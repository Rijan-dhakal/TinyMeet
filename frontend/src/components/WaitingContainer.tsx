const WaitingContainer = ({ text }: { text: string }) => {
  return (
    <div className="flex h-full w-full items-center justify-center px-4 text-center text-sm text-gray-400 sm:text-base">
      {text}
    </div>
  );
};

export default WaitingContainer;
