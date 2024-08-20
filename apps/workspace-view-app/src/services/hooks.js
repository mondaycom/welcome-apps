import mondaySdk from "monday-sdk-js";
import { useCallback, useEffect, useState } from "react";
import { getWorkspaceBoards, getSlug, getWorkspaces } from "./api-service";

const monday = mondaySdk();

export const useLoading = (cb) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState();

  const performAction = useCallback(async () => {
    setIsLoading(true);
    const response = await cb();
    setData(response);
    setIsLoading(false);
  }, [cb]);

  useEffect(() => {
    performAction();
  }, [performAction]);

  return { isLoading, data };
};

export const getAccountDetails = async () => {
  const accountDetails = await monday.storage.getItem("accountDetails");
  if (accountDetails.data.value) return JSON.parse(accountDetails.data.value);

  const slug = await getSlug();
  const baseUrl = `https://${slug}.monday.com/`;
  const accountDetailsToSave = {
    baseUrl,
    slug,
  };
  monday.storage.setItem(
    "accountDetails",
    JSON.stringify(accountDetailsToSave)
  );
  return accountDetailsToSave;
};

export const useGetAccountDetails = () => {
  const { isLoading, data } = useLoading(getAccountDetails);
  return { isLoading, accountDetails: data };
};

export const useGetContext = () => {
  const [context, setContext] = useState({});

  useEffect(() => {
    monday.listen("context", (res) => {
      setContext(res.data);
    });
  }, []);

  return context;
};

export const useFetchBoards = () => {
  const context = useGetContext();
  const fetchBoards = useCallback(async () => {
    const boards = await getWorkspaceBoards(context.workspaceId);
    return boards;
  }, [context.workspaceId]);

  const { isLoading, data } = useLoading(fetchBoards);

  return { isLoading, boards: data };
};

export const useGetWorkspaceData = () => {
  const context = useGetContext();
  const fetchWorkspaces = useCallback(async () => {
    const workspaces = await getWorkspaces(context.workspaceId);
    return workspaces;
  }, [context.workspaceId]);

  const { isLoading, data = [] } = useLoading(fetchWorkspaces);

  return { isLoading, workspaceData: data[0] };
};
