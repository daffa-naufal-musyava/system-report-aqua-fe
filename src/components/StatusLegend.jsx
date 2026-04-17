import React from 'react';

const RunIcon = () => (
  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
    <path d="M13.49 5.48c0 1.1-.89 2-2 2s-2-.9-2-2 .9-2 2-2 2 .9 2 2zm-3.6 13.9l1-4.4 2.1 2v6h2v-7.5l-2.1-2 .6-3c1.3 1.5 3.3 2.5 5.5 2.5v-2c-1.9 0-3.5-1-4.3-2.4l-1-1.6c-.4-.6-1-1-1.7-1-.3 0-.5.1-.8.1l-5.2 2.2v4.7h2v-3.4l1.8-.7-1.6 8.1-4.9-1-.4 2 5.3 1.2z" />
  </svg>
);

const StopIcon = () => <div className="w-3.5 h-3.5 bg-white rounded-sm shadow-[0_0_8px_white]" />;

const StatusLegend = () => {
  return (
    <div className="flex gap-6 text-xs font-black uppercase tracking-wider">
      {/* WARNING */}
      <div className="flex items-center gap-2 text-yellow-400 animate-pulse">
        <div className="bg-yellow-400 px-3 rounded-full flex items-center justify-center h-8">
          <span className="text-2xl text-white font-bold">!</span>
        </div>
        <div className="w-2.5 h-2.5 bg-yellow-400 rounded-full" />
        WARNING
      </div>

      {/* STOP */}
      <div className="flex items-center gap-2 text-red-500">
        <div className="bg-red-500 p-2 rounded-full flex items-center justify-center h-8 w-8">
          <StopIcon />
        </div>
        <div className="w-2.5 h-2.5 bg-red-500 rounded-full" />
        STOP
      </div>

      {/* RUN */}
      <div className="flex items-center gap-2 text-green-400">
        <div className="bg-green-400 p-1 rounded-full flex items-center justify-center h-8 w-8">
          <RunIcon />
        </div>
        <div className="w-2.5 h-2.5 bg-green-400 rounded-full" />
        RUN
      </div>
    </div>
  );
};

export { StatusLegend, RunIcon, StopIcon };