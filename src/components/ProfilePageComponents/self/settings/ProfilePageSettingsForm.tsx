"use client";

import { UserProfile, UserSettings } from "@/lib/db/models";
import { Button, Form, Spinner, Alert } from "react-bootstrap";
import Image from "next/image";
import { useState, useEffect } from "react";
import profileSettingsFormSchema from "@/lib/form_schemas/profileSettingsFormSchema";
import readFile from "@/lib/utils/readFile";
import tempProfilePicture from "@/public/profile-pic-temp.jpg";
import ApiError from "@/lib/errors/ApiError";
import { redirect } from "next/navigation";
import '@/public/ProfilePageSettingsForm.css';

export interface ProfilePageSettingsFormProps {
  profile: UserProfile;
  settings: UserSettings;
  className?: string;
}

interface ValidateErrors {
  profilePicture: string | null;
  gender: string | null;
  about: string | null;
  showName: string | null;
  profilePublic: string | null;
}

export default function ProfilePageSettingsForm({
  profile,
  settings,
  className,
}: ProfilePageSettingsFormProps) {
  const [pending, setPending] = useState<boolean>(false);
  const [success, setSuccess] = useState(false);
  const [redirectSeconds, setRedirectSeconds] = useState(3);

  const [profilePictureFile, setProfilePictureFile] = useState<File>();
  const [gender, setGender] = useState<string>(profile.gender);
  const [about, setAbout] = useState<string>(profile.about);
  const [showName, setShowName] = useState<boolean>(settings.showName);
  const [profilePublic, setProfilePublic] = useState<boolean>(
    settings.profilePublic
  );

  const [validateErrors, setValidateErrors] = useState<ValidateErrors>({
    profilePicture: null,
    gender: null,
    about: null,
    showName: null,
    profilePublic: null,
  });

  const [profilePictureSource, setProfilePictureSource] = useState<string>(
    profile.profilePicture
  );

  useEffect(() => {
    if (success) {
      if (redirectSeconds === 0) {
        redirect("/profile");
      }

      setTimeout(() => {
        setRedirectSeconds(redirectSeconds - 1);
      }, 1000);
    }
  }, [success, redirectSeconds]);

  function addFile(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files.length > 0) {
      setProfilePictureFile(e.target.files[0]);
      readFile(e.target.files[0], (base64string: string) => {
        setProfilePictureSource(base64string);
      });
      setValidateErrors({ ...validateErrors, profilePicture: null });
    }
  }

  function removeFile() {
    setProfilePictureSource("");
    setProfilePictureFile(undefined);
    setValidateErrors({ ...validateErrors, profilePicture: null });
  }

  async function onSubmit() {
    setPending(true);
    setValidateErrors({
      profilePicture: null,
      gender: null,
      about: null,
      showName: null,
      profilePublic: null,
    });

    const validateFields = profileSettingsFormSchema.safeParse({
      profilePicture: profilePictureFile,
      gender: gender,
      about: about,
      showName: showName,
      profilePublic: profilePublic,
    });

    if (!validateFields.success) {
      const errors = validateFields.error.format();
      setValidateErrors({
        profilePicture: errors.profilePicture?._errors[0] || null,
        gender: errors.gender?._errors[0] || null,
        about: errors.about?._errors[0] || null,
        showName: errors.showName?._errors[0] || null,
        profilePublic: errors.profilePublic?._errors[0] || null,
      });
      setPending(false);
    } else {
      const upadtedProfile: UserProfile = {
        ...profile,
        profilePicture: profilePictureSource,
        gender: gender,
        about: about,
      };
      const updatedSettings: UserSettings = {
        ...settings,
        showName: showName,
        profilePublic: profilePublic,
      };

      const profileResponse = await fetch(
        "https://bingus.website/api/crud/user_profile",
        {
          method: "PUT",
          body: JSON.stringify(upadtedProfile),
        }
      );
      const settingsResponse = await fetch(
        "https://bingus.website/api/crud/user_settings",
        {
          method: "PUT",
          body: JSON.stringify(updatedSettings),
        }
      );

      if (profileResponse.status === 200 && settingsResponse.status === 200) {
        setSuccess(true);
      } else if (
        profileResponse.status === 401 ||
        settingsResponse.status === 401
      ) {
        throw new ApiError("Session is inactive. Please log in again.", 401);
      } else {
        throw new ApiError(
          "What the Bingus? An unexpected error occured.",
          500
        );
      }
    }
  }

  return (
    <Form action={onSubmit} className="flex flex-col justify-center">
      <Form.Group controlId="profilePicture">
        <Image
          src={profilePictureSource || tempProfilePicture}
          alt="profile-picture"
          width={200}
          height={200}
          className="rounded-full"
        />
        <Form.Control type="file" onChange={addFile} disabled={pending} />
        {validateErrors.profilePicture && (
          <Form.Label className="text-red-600">
            {validateErrors.profilePicture}
          </Form.Label>
        )}
        {profilePictureFile && (
          <div className="flex gap-2">
            <div>{profilePictureFile.name}</div>
            <Button variant="outline-danger" size="sm" onClick={removeFile}>
              Remove File
            </Button>
          </div>
        )}
      </Form.Group>
      <Form.Group controlId="gender">
        <Form.Label>Gender</Form.Label>
        <Form.Select
          value={gender}
          onChange={(e) => {
            setGender(e.target.value);
            setValidateErrors({ ...validateErrors, gender: null });
          }}
          disabled={pending}
        >
          <option value="">Select Gender</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
          <option value="prefer_not_to_say">Prefer Not To Say</option>
        </Form.Select>
        {validateErrors.gender ? (
          <Form.Label className="text-red-600">
            {validateErrors.gender}
          </Form.Label>
        ) : null}
      </Form.Group>
      <Form.Group controlId="about">
        <Form.Label>About</Form.Label>
        <Form.Control
          type="text"
          placeholder="About"
          value={about}
          onChange={(e) => {
            setAbout(e.target.value);
            setValidateErrors({ ...validateErrors, about: null });
          }}
          disabled={pending}
        />
        {validateErrors.about && (
          <Form.Label className="text-red-600">
            {validateErrors.about}
          </Form.Label>
        )}
      </Form.Group>
      <Form.Group controlId="showName">
        <Form.Check
          type="checkbox"
          label="Show Full Name"
          onChange={(e) => {
            setShowName(!showName);
            setValidateErrors({ ...validateErrors, showName: null });
          }}
          disabled={pending}
          checked={showName}
        />
        {validateErrors.showName && (
          <Form.Label className="text-red-600">
            {validateErrors.showName}
          </Form.Label>
        )}
      </Form.Group>
      <Form.Group controlId="profilePublic">
        <Form.Check
          type="checkbox"
          label="Profile Public"
          onChange={(e) => {
            setProfilePublic(!profilePublic);
            setValidateErrors({ ...validateErrors, profilePublic: null });
          }}
          disabled={pending}
          checked={profilePublic}
        />
        {validateErrors.profilePublic && (
          <Form.Label className="text-red-600">
            {validateErrors.profilePublic}
          </Form.Label>
        )}
      </Form.Group>
      <Form.Group controlId="submit">
        <Button variant="primary" type="submit" disabled={pending}>
          {pending ? (
            <div className="flex gap-2 items-center">
              <Spinner size="sm" animation="border" />
              Submitting...
            </div>
          ) : (
            "Submit"
          )}
        </Button>
      </Form.Group>
      {success && (
        <div
          className="position-fixed top-0 end-0 p-3"
          style={{ zIndex: 1050 }}
        >
          <Alert variant="success">
            <Alert.Heading>Settings updated successfully.</Alert.Heading>
            <p>Redirecting to your profile page...</p>
          </Alert>
        </div>
      )}
    </Form>
  );
}
