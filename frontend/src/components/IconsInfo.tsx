import type { ReactNode } from "react";

interface IconsInfoProps {
  icon: ReactNode;
  text: string;
}

const IconsInfo = ({ icon, text }: IconsInfoProps) => {
  return (
    <div className="flex flex-col items-center">
      {icon}
      <p className="font-semibold ">{text}</p>
    </div>
  );
};

export default IconsInfo;
