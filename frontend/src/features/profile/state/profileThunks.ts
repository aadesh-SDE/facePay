import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SecurityHealth, ProfileData } from "../types/profile.types";
import {
  fetchSecurityHealth,
  fetchMeProfile,
  type MeResponse,
} from "../api/profileApi";
import { getApiErrorMessage } from "@/shared/lib/getApiErrorMessage";

function mapMeToProfile(me: MeResponse): ProfileData {
  return {
    name: me.name,
    mobile: me.mobile,
    email: me.email,
    faceRegistered: me.faceRegistered,
    joinedDate: new Date(me.joinedAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    ...(me.avatar ? { avatar: me.avatar } : {}),
  };
}

export const loadProfileThunk = createAsyncThunk<
  { securityHealth: SecurityHealth; profileData: ProfileData },
  void
>("profile/loadProfile", async (_, { rejectWithValue }) => {
  try {
    const [securityHealth, me] = await Promise.all([
      fetchSecurityHealth(),
      fetchMeProfile(),
    ]);
    return {
      securityHealth,
      profileData: mapMeToProfile(me),
    };
  } catch (err) {
    return rejectWithValue(
      getApiErrorMessage(err, "Failed to load profile"),
    );
  }
});
