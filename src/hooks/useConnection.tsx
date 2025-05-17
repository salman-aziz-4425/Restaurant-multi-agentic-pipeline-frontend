"use client";

import React, { createContext, useCallback, useState, useEffect } from "react";

type TokenGeneratorData = {
  shouldConnect: boolean;
  wsUrl?: string;
  token?: string;
  disconnect: () => Promise<void>;
  connect: () => Promise<void>;
};

const ConnectionContext = createContext<TokenGeneratorData | undefined>(
  undefined
);

export const ConnectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [connectionDetails, setConnectionDetails] = useState<{
    wsUrl?: string;
    token?: string;
    shouldConnect: boolean;
  }>({ shouldConnect: false });

  const connect = useCallback(async () => {
    try {
      const response = await fetch("http://localhost:8000/token", {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Origin': window.location.origin,
        },
        credentials: 'include',
      });
      
      console.log('Token Response:', response);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Token Data:', data);
      
      if (!data.token) {
        throw new Error('Token response missing "token" field');
      }
      
      if (!data.ws_url) {
        throw new Error('Token response missing "ws_url" field');
      }
      
      console.log('Attempting connection with:', {
        wsUrl: data.ws_url,
        tokenLength: data.token.length,
        tokenPreview: `${data.token.substring(0, 20)}...${data.token.substring(data.token.length - 20)}`
      });
      
      // Ensure the WebSocket URL uses the wss:// protocol
      let wsUrl = data.ws_url;
      if (wsUrl && !wsUrl.startsWith('wss://') && !wsUrl.startsWith('ws://')) {
        // If it's an https URL, convert to wss
        if (wsUrl.startsWith('https://')) {
          wsUrl = wsUrl.replace('https://', 'wss://');
        } else if (wsUrl.startsWith('http://')) {
          wsUrl = wsUrl.replace('http://', 'ws://');
        } else {
          // If no protocol, assume wss
          wsUrl = `wss://${wsUrl}`;
        }
      }
      
      console.log('Final WebSocket URL:', wsUrl);
      
      setConnectionDetails({ 
        wsUrl: wsUrl, 
        token: data.token, 
        shouldConnect: true 
      });
    } catch (error) {
      console.error('Error fetching token:', error);
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Failed to connect: Network error - Is the token server running at http://localhost:8000?');
      }
      throw error;
    }
  }, []);

  const disconnect = useCallback(async () => {
    setConnectionDetails((prev) => ({ ...prev, shouldConnect: false }));
  }, []);

  useEffect(() => {
    console.log('Connection details updated:', {
      shouldConnect: connectionDetails.shouldConnect,
      wsUrl: connectionDetails.wsUrl || 'not set',
      tokenAvailable: connectionDetails.token ? 'yes' : 'no',
      tokenLength: connectionDetails.token?.length || 0
    });
  }, [connectionDetails]);

  return (
    <ConnectionContext.Provider
      value={{
        shouldConnect: connectionDetails.shouldConnect,
        wsUrl: connectionDetails.wsUrl,
        token: connectionDetails.token,
        connect,
        disconnect,
      }}
    >
      {children}
    </ConnectionContext.Provider>
  );
};

export const useConnection = () => {
  const context = React.useContext(ConnectionContext);
  if (context === undefined) {
    throw new Error("useConnection must be used within a ConnectionProvider");
  }
  return context;
};
