import { Pencil } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert } from "~/components/alert/Alert";
import Header from "~/components/Header";
import RootView from "~/components/layout/RootView";
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
import { SecureStorage, SecureStorageData } from "~/lib/classes/SecureStorage";
import { useFetchMutation } from "~/lib/hooks/useFetchMutation";
import { capitalizeFirst } from "~/lib/utils";

export default function ProfileSettings() {
  const [t] = useTranslation();

  const [userSession, setUserSession] = useState<
    SecureStorageData["userSession"] | null
  >(null);
  const [originalUserSession, setOriginalUserSession] = useState<
    SecureStorageData["userSession"] | null
  >(null);
  const [lastName, setLastName] = useState(userSession?.lastName || "");
  const [firstName, setFirstName] = useState(userSession?.firstName || "");
  const [email, setEmail] = useState(userSession?.email || "");
  const primaryRole = (roles: ("ROLE_USER" | "ROLE_ADMIN")[] | undefined) =>
    roles?.includes("ROLE_ADMIN") ? "ROLE_ADMIN" : "ROLE_USER";
  const [role, setRole] = useState(primaryRole(userSession?.roles));
  const [isEditing, setIsEditing] = useState(false);
  const { mutate: updateUser } = useFetchMutation("/api/users/me", "patch");

  const handleSubmit = () => {
    updateUser(
      {
        body: {
          first_name: firstName,
          last_name: lastName,
          email: email,
        },
      },
      {
        onSuccess: () => {
          console.log("success");
          // Update stored session with new values
          SecureStorage.get("userSession").then((session) => {
            if (session) {
              SecureStorage.set("userSession", {
                ...session,
                firstName,
                lastName,
                email,
              });
            }
          });
          setOriginalUserSession((prev) =>
            prev ? { ...prev, firstName, lastName, email } : prev,
          );
          setIsEditing(false);
        },
        onError: () => {
          console.log("error");
        },
      },
    );
  };

  const handleToggleEditing = (newState: boolean) => {
    if (
      isEditing &&
      (lastName !== originalUserSession?.lastName ||
        firstName !== originalUserSession?.firstName ||
        email !== originalUserSession?.email)
    ) {
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
              if (originalUserSession) {
                setLastName(originalUserSession.lastName);
                setFirstName(originalUserSession.firstName);
                setEmail(originalUserSession.email);
              }
              setIsEditing(false);
            },
          },
        ],
      );
    } else {
      setIsEditing(newState);
    }
  };

  type Option = {
    value: "ROLE_USER" | "ROLE_ADMIN";
    label: string;
  };

  const ROLE_OPTIONS: Option[] = [
    { value: "ROLE_ADMIN", label: capitalizeFirst(t("user.ROLE_ADMIN")) },
    { value: "ROLE_USER", label: capitalizeFirst(t("user.ROLE_USER")) },
  ];

  useEffect(() => {
    if (!userSession) {
      SecureStorage.get("userSession").then((userSession) => {
        if (userSession) {
          setUserSession(userSession);
          setOriginalUserSession(userSession);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (userSession) {
      setLastName(userSession.lastName);
      setFirstName(userSession.firstName);
      setEmail(userSession.email);
      setRole(primaryRole(userSession.roles));
    }
  }, [userSession]);

  return (
    <RootView>
      <Header title={capitalizeFirst(t("settings.profile.name"))}>
        <Tooltip delayDuration={150} className="ml-auto">
          <TooltipTrigger asChild>
            <Toggle
              pressed={isEditing}
              onPressedChange={handleToggleEditing}
              aria-label="Toggle editing mode"
              variant="outline"
            >
              <ToggleIcon as={Pencil} size={20} />
            </Toggle>
          </TooltipTrigger>
          <TooltipContent>
            <Text className="native:text-lg">{t("Toggle editing mode")}</Text>
          </TooltipContent>
        </Tooltip>
      </Header>

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
        onValueChange={(option) =>
          setRole(
            (option?.value as ("ROLE_USER" | "ROLE_ADMIN") | undefined) ??
              "ROLE_USER",
          )
        }
        value={ROLE_OPTIONS.find((option) => option.value === role)}
        defaultValue={ROLE_OPTIONS.find(
          (option) => option.value === primaryRole(userSession?.roles),
        )}
      >
        <SelectTrigger className="w-full" disabled={!isEditing}>
          <SelectValue
            placeholder={
              ROLE_OPTIONS.find(
                (option) => option.value === primaryRole(userSession?.roles),
              )?.label || capitalizeFirst(t("user.role"))
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

      {isEditing && (
        <Button onPress={handleSubmit} className="mb-4" variant={"outline"}>
          <Text>{capitalizeFirst(t("common.save"))}</Text>
        </Button>
      )}
    </RootView>
  );
}
