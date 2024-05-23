import React, { useContext } from "react";
import { Context } from "../components/context/ContextProvider";
import { HashRouter, Route } from "react-router-dom";
import Menu from "../features/Menu/Menu";
import Welcome from "../features/Welcome/Welcome";
import GetSubItems from "../features/GetSubItems/GetSubItems";
import DeleteItem from "../features/DeleteItem/DeleteItem";
import OpenItemCard from "../features/OpenItemCard/OpenItemCard";
import WorkingWithSettings from "../features/WorkingWithSettings/WorkingWithSettings";
import UploadFileViaSDK from "../features/UploadFileViaSDK/UploadFileViaSDK";
import UploadFileViaAPI from "../features/UploadFileViaAPI/UploadFileViaAPI";
import StorageApi from "../features/StorageApi/StorageApi";
import { ROUTES } from "../features/Menu/MenuConstants";
import Confirmation from "../features/Confirmation/Confirmation";
import Notice from "../features/Notice/Notice";
import FilePreview from "../features/FilePreview/FilePreview";

import Pagination from "../features/Pagination/Pagination";
import UpdateSubitems from "../features/UpdateSubitems/UpdateSubitems";
import DeleteSubitem from "../features/DeleteSubitem/DeleteSubitem";
import ArchiveSubitem from "../features/ArchiveSubitem/ArchiveSubitem";
import NoBoardSelected from "../components/common/NoBoardSelected/NoBoardSelected";
import GetUpdates from "../features/GetUpdates/GetUpdates";

const LayoutRouter = () => {
  const { items } = useContext(Context);

  return items.length > 0 ? (
    <HashRouter>
      <Route exact path="/" component={Welcome} />
      <Route path={`/${ROUTES.MENU}`} component={Menu} />
      <Route path={`/${ROUTES.GET_SUB_ITEMS}`} component={GetSubItems} />
      <Route path={`/${ROUTES.DELETE_ITEM}`} component={DeleteItem} />
      <Route path={`/${ROUTES.OPEN_ITEM_CARD}`} component={OpenItemCard} />
      <Route path={`/${ROUTES.UPLOAD_FILE_VIA_SDK}`} component={UploadFileViaSDK} />
      <Route path={`/${ROUTES.UPLOAD_FILE_VIA_API}`} component={UploadFileViaAPI} />
      <Route path={`/${ROUTES.STORAGE_API}`} component={StorageApi} />
      <Route path={`/${ROUTES.CONFIRMATION}`} component={Confirmation} />
      <Route path={`/${ROUTES.NOTICE}`} component={Notice} />
      <Route path={`/${ROUTES.FILEPREVIEW}`} component={FilePreview} />
      <Route path={`/${ROUTES.WORKING_WITH_SETTINGS}`} component={WorkingWithSettings} />
      <Route path={`/${ROUTES.PAGINATED}`} component={Pagination} />
      <Route path={`/${ROUTES.UPDATE_SUBITEM}`} component={UpdateSubitems} />
      <Route path={`/${ROUTES.DELETE_SUBITEM}`} component={DeleteSubitem} />
      <Route path={`/${ROUTES.ARCHIVE_SUBITEM}`} component={ArchiveSubitem} />
      <Route path={`/${ROUTES.UPDATES}`} component={GetUpdates} />
    </HashRouter>
  ) : (
    <NoBoardSelected />
  );
};

export default LayoutRouter;
