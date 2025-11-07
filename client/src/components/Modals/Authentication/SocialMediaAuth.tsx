import { Button } from "@/components/ui/button";
import { Icon } from "@iconify/react";

const buttonsInfo = [
  {
    icon: "logos:apple",
    label: "Apple",
    disabled: true,
    iconClassName: "dark:invert",
  },
  {
    icon: "logos:facebook",
    label: "Facebook",
    disabled: true,
    iconClassName: "",
  },
  {
    icon: "logos:google-icon",
    label: "Google",
    disabled: true,
    iconClassName: "",
  },
];

export default function SocialMediaAuth() {
  return (
    <div className="flex gap-2 w-full flex-row justify-center">
      {buttonsInfo.map((button) => (
        <Button
          key={button.label}
          variant="outline"
          className="justify-center flex-1"
          disabled={button.disabled}
        >
          <Icon
            icon={button.icon}
            className={`w-4 h-4 sm:mr-2 flex-shrink-0 ${button.iconClassName}`}
          />
          <span className={`hidden sm:block`}>{button.label}</span>
        </Button>
      ))}
    </div>
  );
}
