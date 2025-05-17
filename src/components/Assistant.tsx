"use client";

import { LoadingSVG } from "@/components/button/LoadingSVG";
import { Header } from "@/components/Header";
import { Tile } from "@/components/Tile";
import { AgentMultibandAudioVisualizer } from "@/components/visualization/AgentMultibandAudioVisualizer";
import { useMultibandTrackVolume } from "@/hooks/useTrackVolume";
import { useWindowResize } from "@/hooks/useWindowResize";
import {
  useConnectionState,
  useLocalParticipant,
  useTracks,
  useVoiceAssistant,
} from "@livekit/components-react";
import { AnimatePresence, motion } from "framer-motion";
import { ConnectionState, LocalParticipant, Track } from "livekit-client";
import { ReactNode, useEffect, useMemo, useState } from "react";
import { Button } from "./button/Button";
import { MicrophoneButton } from "./MicrophoneButton";

export interface AssistantProps {
  title?: string;
  logo?: ReactNode;
  onConnect: (connect: boolean) => void;
}

const headerHeight = 56;
const mobileWindowWidth = 768;
const desktopBarWidth = 72;
const desktopMaxBarHeight = 280;
const desktopMinBarHeight = 60;
const mobileMaxBarHeight = 140;
const mobileMinBarHeight = 48;
const mobileBarWidth = 48;
const barCount = 5;
const defaultVolumes = Array.from({ length: barCount }, () => [0.0]);

export default function Assistant({ title, logo, onConnect }: AssistantProps) {
  const { localParticipant } = useLocalParticipant();
  const windowSize = useWindowResize();
  const {
    agent: agentParticipant,
    state: agentState,
    audioTrack: agentAudioTrack,
  } = useVoiceAssistant();
  const [isMobile, setIsMobile] = useState(false);

  const roomState = useConnectionState();
  const tracks = useTracks();

  useEffect(() => {
    console.log('Agent State:', {
      agentParticipant: agentParticipant ? 'Connected' : 'Not Connected',
      agentState,
      agentAudioTrack: agentAudioTrack ? 'Available' : 'Not Available',
      roomState
    });
  }, [agentParticipant, agentState, agentAudioTrack, roomState]);

  useEffect(() => {
    setIsMobile(windowSize.width < mobileWindowWidth);
  }, [windowSize]);

  useEffect(() => {
    if (roomState === ConnectionState.Connected) {
      localParticipant.setMicrophoneEnabled(true);
    }
  }, [localParticipant, roomState]);

  const subscribedVolumes = useMultibandTrackVolume(
    agentAudioTrack?.publication.track,
    barCount
  );

  const localTracks = tracks.filter(
    ({ participant }) => participant instanceof LocalParticipant
  );
  const localMicTrack = localTracks.find(
    ({ source }) => source === Track.Source.Microphone
  );

  const localMultibandVolume = useMultibandTrackVolume(
    localMicTrack?.publication.track,
    9
  );

  const audioTileContent = useMemo(() => {
    const conversationToolbar = (
      <div className="fixed z-50 md:absolute left-1/2 bottom-4 md:bottom-auto md:top-1/2 -translate-y-1/2 -translate-x-1/2">
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 25 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            state="destructive"
            className=""
            size="medium"
            onClick={() => onConnect(roomState === ConnectionState.Disconnected)}
          >
            Disconnect
          </Button>
          <MicrophoneButton localMultibandVolume={localMultibandVolume} />
        </motion.div>
      </div>
    );

    const isLoading = roomState === ConnectionState.Connecting;
    const startConversationButton = (
      <div className="fixed bottom-2 md:bottom-auto md:absolute left-1/2 md:top-1/2 -translate-y-1/2 -translate-x-1/2 w-11/12 md:w-auto text-center">
        <motion.div
          className="flex gap-3"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
        >
          <Button
            state="primary"
            size="large"
            className="relative w-full text-sm md:text-base hover:scale-105 transition-transform"
            onClick={() => onConnect(roomState === ConnectionState.Disconnected)}
          >
            <div className={`w-full ${isLoading ? "opacity-0" : "opacity-100"}`}>
              Start Ordering
            </div>
            <div className={`absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2 ${
              isLoading ? "opacity-100" : "opacity-0"
            }`}>
              <LoadingSVG diameter={24} strokeWidth={4} />
            </div>
          </Button>
        </motion.div>
      </div>
    );

    return (
      <div className="flex flex-col items-center justify-space-between h-full w-full pb-12">
        <div className="h-full flex">
          <AgentMultibandAudioVisualizer
            state={agentState}
            barWidth={isMobile ? mobileBarWidth : desktopBarWidth}
            minBarHeight={isMobile ? mobileMinBarHeight : desktopMinBarHeight}
            maxBarHeight={isMobile ? mobileMaxBarHeight : desktopMaxBarHeight}
            frequencies={!agentAudioTrack ? defaultVolumes : subscribedVolumes}
            gap={16}
          />
        </div>
        <div className="min-h-20 w-full relative">
          <AnimatePresence>
            {roomState !== ConnectionState.Connected ? startConversationButton : null}
          </AnimatePresence>
          <AnimatePresence>
            {roomState === ConnectionState.Connected ? conversationToolbar : null}
          </AnimatePresence>
        </div>
      </div>
    );
  }, [
    localMultibandVolume,
    roomState,
    agentAudioTrack,
    isMobile,
    subscribedVolumes,
    onConnect,
    agentState,
  ]);

  return (
    <>
      <Header
        title={title}
        logo={logo}
        height={headerHeight}
        onConnectClicked={() => onConnect(roomState === ConnectionState.Disconnected)}
      />
      <div
        className="flex grow w-full selection:bg-cyan-900"
        style={{ height: `calc(100% - ${headerHeight}px)` }}
      >
        <div className="flex-col grow h-full flex">
          <Tile
            title="RESTAURANT ASSISTANT"
            className="w-full h-full grow bg-muted/50 backdrop-blur-sm border-accent/20"
            childrenClassName="justify-center"
          >
            {audioTileContent}
          </Tile>
        </div>
      </div>
    </>
  );
}
