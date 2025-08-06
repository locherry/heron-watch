import { t } from "i18next";
import { useEffect, useState } from "react";
import RootView from "~/components/layout/RootView";
import Row from "~/components/layout/Row";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Text } from "~/components/ui/text";
import { Toggle, ToggleIcon } from "~/components/ui/toggle";
import { H3 } from "~/components/ui/typography";
import { Pencil } from "~/lib/icons/Pencil";
import { SecureStorage, SecureStorageData } from "~/lib/SecureStorage";
import { capitalizeFirst } from "~/lib/utils";

export default function ProfileSettings() {
  const [userID, setUserID] = useState<number | null>(null); // State for user ID
  const [userSession, setUserSession] = useState<
    SecureStorageData["userSession"] | null
  >(null); // State for user ID
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = () => {};

  // Define Option type
  type Option = {
    value: SecureStorageData["userSession"]["role"];
    label: string;
  };

  const ROLE_OPTIONS: Option[] = [
    { value: "admin", label: capitalizeFirst(t("user.admin")) },
    { value: "user", label: capitalizeFirst(t("user.user")) },
  ];

  useEffect(() => {
    if (!userSession) {
      SecureStorage.get("userSession").then((userSession) => {
        if (userSession) {
          setUserSession(userSession);
        }
      });
    }
  });

  return (
    <RootView>
      <Row className="flex-none justify-between items-center">
        <H3>Profile Settings</H3>
        <Toggle
          pressed={isEditing}
          onPressedChange={setIsEditing}
          aria-label="Toggle editing mode"
          variant="outline"
        >
          <ToggleIcon icon={Pencil} size={18} />
        </Toggle>
      </Row>

      <Label>{capitalizeFirst(t("user.lastName"))}</Label>
      <Input
        defaultValue={userSession?.lastName || ""}
        onChangeText={(text) => setLastName(text)}
        editable={isEditing}
        className="mb-4"
      />

      <Label>{capitalizeFirst(t("user.firstName"))}</Label>
      <Input
        defaultValue={userSession?.firstName || ""}
        onChangeText={(text) => setFirstName(text)}
        editable={isEditing}
        className="mb-4"
      />

      <Label>{capitalizeFirst(t("user.email"))}</Label>
      <Input
        defaultValue={userSession?.email || ""}
        onChangeText={(text) => setEmail(text)}
        editable={isEditing}
        className="mb-4"
      />

      <Label>{capitalizeFirst(t("user.role"))}</Label>
      <Select
        className="mb-4"
        defaultValue={ROLE_OPTIONS.find(
          (option) => option.value === userSession?.role
        )}
      >
        <SelectTrigger className="w-full" disabled={!isEditing}>
          <SelectValue
            placeholder={
              ROLE_OPTIONS.find((option) => option.value === userSession?.role)
                ?.label || capitalizeFirst(t("user.role"))
            }
          />
        </SelectTrigger>
        <SelectContent>
          {ROLE_OPTIONS.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </SelectContent>
      </Select>

      {/* Submit Button */}
      {isEditing && (
        <Button onPress={handleSubmit} className="mb-4">
          <Text>{capitalizeFirst(t("common.save"))}</Text>
        </Button>
      )}
    </RootView>
  );
}
