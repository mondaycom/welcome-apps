import React, { useContext } from "react";
import { Context } from "../components/context/ContextProvider";
import { HashRouter, Route } from "react-router-dom";
import Menu from "../examples/Menu/Menu";
import Welcome from "../examples/Welcome/Welcome";
import GetSubItems from "../examples/GetSubItems/GetSubItems";
import DeleteItem from "../examples/DeleteItem/DeleteItem";
import OpenItemCard from "../examples/OpenItemCard/OpenItemCard";
import WorkingWithSettings from "../examples/WorkingWithSettings/WorkingWithSettings";
import UploadFileViaSDK from "../examples/UploadFileViaSDK/UploadFileViaSDK";
import UploadFileViaAPI from "../examples/UploadFileViaAPI/UploadFileViaAPI";
import StorageApi from "../examples/StorageApi/StorageApi";
import { ROUTES } from "../examples/Menu/MenuConstants";
import Confirmation from "../examples/Confirmation/Confirmation";
import Notice from "../examples/Notice/Notice";
import FilePreview from "../examples/FilePreview/FilePreview";

import Pagination from "../examples/Pagination/Pagination";
import UpdateSubitems from "../examples/UpdateSubitems/UpdateSubitems";
import DeleteSubitem from "../examples/DeleteSubitem/DeleteSubitem";
import ArchiveSubitem from "../examples/ArchiveSubitem/ArchiveSubitem";
import NoBoardSelected from "../components/common/NoBoardSelected/NoBoardSelected";
import GetUpdates from "../examples/GetUpdates/GetUpdates";

const LayoutRouter = () => {
  // TODO: move error state somewhere else
  const { items } = useContext(Context);
  console.log(items);

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
