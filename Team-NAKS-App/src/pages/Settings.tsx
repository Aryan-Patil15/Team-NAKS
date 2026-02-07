import { motion } from "framer-motion";
import { User, Bell, Lock } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SettingsPage = () => {
  return (
    <div className="space-y-6 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-2">
          Preferences
        </p>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Manage your account preferences and privacy.
        </p>
      </motion.div>

      <div className="space-y-4">
        <SettingSection
          icon={Bell}
          title="Notifications"
          description="Control how you receive updates"
        >
          <SettingRow label="Email notifications" defaultChecked={true} />
          <SettingRow label="Mentorship requests" defaultChecked={true} />
          <SettingRow label="Event reminders" defaultChecked={false} />
          <SettingRow label="Job board updates" defaultChecked={true} />
        </SettingSection>

        <SettingSection
          icon={Lock}
          title="Privacy"
          description="Control your profile visibility"
        >
          <SettingRow label="Show profile in alumni directory" defaultChecked={true} />
          <SettingRow label="Allow students to message me" defaultChecked={true} />
          <SettingRow label="Show my company information" defaultChecked={true} />
        </SettingSection>

        <SettingSection
          icon={User}
          title="Account"
          description="Manage your account settings"
        >
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-foreground">Delete Account</p>
              <p className="text-xs text-muted-foreground">Permanently remove your account</p>
            </div>
            <Button variant="outline" size="sm" className="text-destructive border-destructive/30 hover:bg-destructive/10">
              Delete
            </Button>
          </div>
        </SettingSection>
      </div>
    </div>
  );
};

function SettingSection({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: any;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon className="h-4.5 w-4.5 text-primary" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="text-xs text-muted-foreground">{description}</p>
        </div>
      </div>
      <Separator className="mb-2" />
      <div className="divide-y divide-border">{children}</div>
    </motion.div>
  );
}

function SettingRow({ label, defaultChecked }: { label: string; defaultChecked: boolean }) {
  return (
    <div className="flex items-center justify-between py-3">
      <p className="text-sm text-foreground">{label}</p>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}

export default SettingsPage;
