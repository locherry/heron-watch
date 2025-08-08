import { t } from "i18next";
import { useEffect, useState } from "react";
import { Alert } from "~/components/Alert/Alert";
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { H3 } from "~/components/ui/typography";
import { Pencil } from "~/lib/icons/Pencil";
import { SecureStorage, SecureStorageData } from "~/lib/SecureStorage";
import { useApiMutation } from "~/lib/useApiMutation";
import { capitalizeFirst } from "~/lib/utils";

export default function ProfileSettings() {
  const [userSession, setUserSession] = useState<
    SecureStorageData["userSession"] | null
  >(null);
  const [originalUserSession, setOriginalUserSession] = useState<
    SecureStorageData["userSession"] | null
  >(null); // Store the original user session data
  const [lastName, setLastName] = useState(userSession?.lastName || "");
  const [firstName, setFirstName] = useState(userSession?.firstName || "");
  const [email, setEmail] = useState(userSession?.email || "");
  const [role, setRole] = useState(userSession?.role || "user");
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateUser } = useApiMutation("/users/{userID}", "patch");

  const handleSubmit = () => {
    if (userSession) {
      updateUser(
        {
          pathParams: { userID: userSession.id },
          body: {
            user_info: {
              first_name: firstName,
              last_name: lastName,
              email: email,
              role: role,
            },
          },
        },
        {
          onSuccess: () => {
            console.log("success");
          },
          onError: () => {
            console.log("error");
          },
        }
      );
    }
  };

  const handleToggleEditing = (newState: boolean) => {
    if (
      isEditing &&
      (lastName !== originalUserSession?.lastName ||
        firstName !== originalUserSession?.firstName ||
        email !== originalUserSession?.email)
    ) {
      // If there are unsaved changes, show the confirmation alert
      Alert.alert(
        t("Please confirm"),
        t("Do you really want to discard the unsaved changes?"),
        [
          {
            text: t("common.cancel"),
            onPress: () => console.info("Cancel Pressed"),
            style: "cancel",
          },
          {
            text: t("common.OK"),
            onPress: () => {
              // Reset form fields to original user session data and exit edit mode
              if (originalUserSession) {
                setLastName(originalUserSession.lastName);
                setFirstName(originalUserSession.firstName);
                setEmail(originalUserSession.email);
              }
              setIsEditing(false); // Turn off editing mode
            },
          },
        ]
      );
    } else {
      // If no changes, simply toggle the editing mode
      setIsEditing(newState);
    }
  };

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
          setOriginalUserSession(userSession); // Store the initial user session as original
        }
      });
    }
  }, []);

  useEffect(() => {
    if (userSession) {
      setLastName(userSession.lastName);
      setFirstName(userSession.firstName);
      setEmail(userSession.email);
    }
  }, [userSession]);

  return (
    <RootView>
      <Row className="flex-none justify-between items-center">
        <H3>Profile Settings</H3>
        <Tooltip delayDuration={150}>
          <TooltipTrigger asChild>
            <Toggle
              pressed={isEditing}
              onPressedChange={handleToggleEditing} // Updated to use handleToggleEditing
              aria-label="Toggle editing mode"
              variant="outline"
            >
              <ToggleIcon icon={Pencil} size={18} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <Text className="native:text-lg">{t("Toggle editing mode")}</Text>
          </TooltipContent>
        </Tooltip>
      </Row>

      <Label>{capitalizeFirst(t("user.lastName"))}</Label>
      <Input
        value={lastName}
        onChangeText={(text) => setLastName(text)}
        editable={isEditing}
        className="mb-4"
      />

      <Label>{capitalizeFirst(t("user.firstName"))}</Label>
      <Input
        value={firstName}
        onChangeText={(text) => setFirstName(text)}
        editable={isEditing}
        className="mb-4"
      />

      <Label>{capitalizeFirst(t("user.email"))}</Label>
      <Input
        value={email}
        onChangeText={(text) => setEmail(text)}
        editable={isEditing}
        className="mb-4"
      />

      <Label>{capitalizeFirst(t("user.role"))}</Label>
      <Select
        className="mb-4"
        onValueChange={(option) => setRole(option?.value as SecureStorageData["userSession"]["role"]|undefined ?? "user")}
        value={ROLE_OPTIONS.find((option) => option.value === role)}
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
        <Button onPress={handleSubmit} className="mb-4" variant={"outline"}>
          <Text>{capitalizeFirst(t("common.save"))}</Text>
        </Button>
      )}
    </RootView>
  );
}
