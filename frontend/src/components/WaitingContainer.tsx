const WaitingContainer = ({ text }: { text: string }) => {
  return (
    <div className="flex h-125 items-center justify-center text-gray-400">
      {text}
    </div>
  );
};
export default WaitingContainer;
