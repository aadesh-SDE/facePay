import { createAsyncThunk } from "@reduxjs/toolkit";
import { saveFaceDescriptor, getFaceDescriptor } from "../api/faceApi";
import type { RootState } from "@/app/store";

export const registerFaceThunk = createAsyncThunk<
  number[],
  number[],
  { state: RootState; rejectValue: string }
>("face/register", async (descriptor, { getState, rejectWithValue }) => {
  try {
    const userId = getState().auth.user?.id;
    if (!userId) return rejectWithValue("User not authenticated");

    const response = await saveFaceDescriptor({ userId, descriptor });
    if (!response.success) return rejectWithValue("Failed to save face data");

    return descriptor;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Face registration failed",
    );
  }
});

export const loadDescriptorThunk = createAsyncThunk<
  number[] | null,
  void,
  { state: RootState; rejectValue: string }
>("face/loadDescriptor", async (_, { getState, rejectWithValue }) => {
  try {
    const userId = getState().auth.user?.id;
    if (!userId) return rejectWithValue("User not authenticated");

    const response = await getFaceDescriptor(userId);
    return response.descriptor;
  } catch (err) {
    return rejectWithValue(
      err instanceof Error ? err.message : "Failed to load face data",
    );
  }
});
