export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  CompareValue: { input: any; output: any; }
  /** A date. */
  Date: { input: any; output: any; }
  /** A multipart file */
  File: { input: any; output: any; }
  /** An ISO 8601-encoded datetime */
  ISO8601DateTime: { input: any; output: any; }
  /** A JSON formatted string. */
  JSON: { input: any; output: any; }
};

/** Your monday.com account */
export type Account = {
  __typename?: 'Account';
  /** The number of active member users in the account */
  active_members_count?: Maybe<Scalars['Int']['output']>;
  /** The account's country two-letter code in ISO3166 format */
  country_code?: Maybe<Scalars['String']['output']>;
  /** The first day of the week for the account (sunday / monday) */
  first_day_of_the_week: FirstDayOfTheWeek;
  /** The account's unique identifier. */
  id: Scalars['ID']['output'];
  /** The account's logo. */
  logo?: Maybe<Scalars['String']['output']>;
  /** The account's name. */
  name: Scalars['String']['output'];
  /** The account's payment plan. */
  plan?: Maybe<Plan>;
  /** The account's active products */
  products?: Maybe<Array<Maybe<AccountProduct>>>;
  /** Show weekends in timeline */
  show_timeline_weekends: Scalars['Boolean']['output'];
  /** The product the account signed up to first. */
  sign_up_product_kind?: Maybe<Scalars['String']['output']>;
  /** The account's slug. */
  slug: Scalars['String']['output'];
  /** The account's tier. */
  tier?: Maybe<Scalars['String']['output']>;
};

/** The product a workspace is used in. */
export type AccountProduct = {
  __typename?: 'AccountProduct';
  /** The account product default workspace id */
  default_workspace_id?: Maybe<Scalars['ID']['output']>;
  /** The account product id */
  id?: Maybe<Scalars['ID']['output']>;
  /**
   * The account product kind (core / marketing / crm / software /
   * projectManagement / project_management / service / forms / whiteboard).
   */
  kind?: Maybe<Scalars['String']['output']>;
};

/** An activity log event */
export type ActivityLogType = {
  __typename?: 'ActivityLogType';
  account_id: Scalars['String']['output'];
  created_at: Scalars['String']['output'];
  /** The item's column values in string form. */
  data: Scalars['String']['output'];
  entity: Scalars['String']['output'];
  event: Scalars['String']['output'];
  id: Scalars['String']['output'];
  user_id: Scalars['String']['output'];
};

/** An app install details. */
export type AppInstall = {
  __typename?: 'AppInstall';
  /** The app's unique identifier. */
  app_id: Scalars['ID']['output'];
  /** An app installer's account details. */
  app_install_account: AppInstallAccount;
  /** An app installer's user details */
  app_install_user: AppInstallUser;
  /** The app's version details */
  app_version?: Maybe<AppVersion>;
  /** The required and approved scopes for an app install. */
  permissions?: Maybe<AppInstallPermissions>;
  /** Installation date */
  timestamp?: Maybe<Scalars['String']['output']>;
};

/** An app installer's account details */
export type AppInstallAccount = {
  __typename?: 'AppInstallAccount';
  /** The app's installer account id. */
  id: Scalars['ID']['output'];
};

/** The required and approved scopes for an app install. */
export type AppInstallPermissions = {
  __typename?: 'AppInstallPermissions';
  /** The scopes approved by the account admin */
  approved_scopes: Array<Scalars['String']['output']>;
  /** The scopes required by the latest live version */
  required_scopes: Array<Scalars['String']['output']>;
};

/** An app installer's user details */
export type AppInstallUser = {
  __typename?: 'AppInstallUser';
  /** The app's installer user id. */
  id?: Maybe<Scalars['ID']['output']>;
};

/** The app monetization status for the current account */
export type AppMonetizationStatus = {
  __typename?: 'AppMonetizationStatus';
  /** Is apps monetization is supported for the account */
  is_supported: Scalars['Boolean']['output'];
};

/** The account subscription details for the app. */
export type AppSubscription = {
  __typename?: 'AppSubscription';
  /** The type of the billing period [monthly/yearly]. */
  billing_period?: Maybe<Scalars['String']['output']>;
  /** The number of days left until the subscription ends. */
  days_left?: Maybe<Scalars['Int']['output']>;
  /** Is the subscription a trial */
  is_trial?: Maybe<Scalars['Boolean']['output']>;
  /** The subscription plan id (on the app's side). */
  plan_id: Scalars['String']['output'];
  /** The pricing version of subscription plan. */
  pricing_version?: Maybe<Scalars['Int']['output']>;
  /** The subscription renewal date. */
  renewal_date: Scalars['Date']['output'];
};

/** The Operations counter response for the app action. */
export type AppSubscriptionOperationsCounter = {
  __typename?: 'AppSubscriptionOperationsCounter';
  /** The account subscription details for the app. */
  app_subscription?: Maybe<AppSubscription>;
  /** The new counter value. */
  counter_value?: Maybe<Scalars['Int']['output']>;
  /** Operations name. */
  kind: Scalars['String']['output'];
  /** Window key. */
  period_key?: Maybe<Scalars['String']['output']>;
};

/** An app's version details. */
export type AppVersion = {
  __typename?: 'AppVersion';
  /** The app's major version. */
  major: Scalars['Int']['output'];
  /** The app's minor version. */
  minor: Scalars['Int']['output'];
  /** The app's patch version. */
  patch: Scalars['Int']['output'];
  /** The app's version text */
  text: Scalars['String']['output'];
  /** The app's version type. */
  type?: Maybe<Scalars['String']['output']>;
};

/** The app monetization information for the current account */
export type AppsMonetizationInfo = {
  __typename?: 'AppsMonetizationInfo';
  /**
   * The number of seats in the account, across all products, used to match the
   * app’s subscription among apps that utilize the seats-based monetization method
   */
  seats_count?: Maybe<Scalars['Int']['output']>;
};

/** A file uploaded to monday.com */
export type Asset = {
  __typename?: 'Asset';
  /** The file's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The file's extension. */
  file_extension: Scalars['String']['output'];
  /** The file's size in bytes. */
  file_size: Scalars['Int']['output'];
  /** The file's unique identifier. */
  id: Scalars['ID']['output'];
  /** The file's name. */
  name: Scalars['String']['output'];
  /** original geometry of the asset. */
  original_geometry?: Maybe<Scalars['String']['output']>;
  /** public url to the asset, valid for 1 hour. */
  public_url: Scalars['String']['output'];
  /** The user who uploaded the file. */
  uploaded_by: User;
  /** url to view the asset. */
  url: Scalars['String']['output'];
  /** url to view the asset in thumbnail mode. Only available for images. */
  url_thumbnail?: Maybe<Scalars['String']['output']>;
};

/** The source of the asset */
export enum AssetsSource {
  /** Assets from file columns and item's files gallery */
  All = 'all',
  /** Assets only from file columns */
  Columns = 'columns',
  /** Assets only from item's files gallery */
  Gallery = 'gallery'
}

/** Result of an batch operation */
export type BatchExtendTrialPeriod = {
  __typename?: 'BatchExtendTrialPeriod';
  /** Details of operations */
  details?: Maybe<Array<ExtendTrialPeriod>>;
  /** Reason of an error */
  reason?: Maybe<Scalars['String']['output']>;
  /** Result of a batch operation */
  success: Scalars['Boolean']['output'];
};

/** A monday.com board. */
export type Board = {
  __typename?: 'Board';
  /** The board log events. */
  activity_logs?: Maybe<Array<Maybe<ActivityLogType>>>;
  /** The board's folder unique identifier. */
  board_folder_id?: Maybe<Scalars['ID']['output']>;
  /** The board's kind (public / private / share). */
  board_kind: BoardKind;
  /** The board's visible columns. */
  columns?: Maybe<Array<Maybe<Column>>>;
  /** Get the board communication value - typically meeting ID */
  communication?: Maybe<Scalars['JSON']['output']>;
  /** The creator of the board. */
  creator: User;
  /** The board's description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The board's visible groups. */
  groups?: Maybe<Array<Maybe<Group>>>;
  /** The unique identifier of the board. */
  id: Scalars['ID']['output'];
  /** The Board's item nickname, one of a predefined set of values, or a custom user value */
  item_terminology?: Maybe<Scalars['String']['output']>;
  /** The number of items on the board */
  items_count?: Maybe<Scalars['Int']['output']>;
  /** The board's items (rows). */
  items_page: ItemsResponse;
  /** The board's name. */
  name: Scalars['String']['output'];
  /**
   * The owner of the board.
   * @deprecated This field returned creator of the board. Please use 'creator' or 'owners' fields instead.
   */
  owner: User;
  /** List of user board owners */
  owners: Array<Maybe<User>>;
  /** The board's permissions. */
  permissions: Scalars['String']['output'];
  /** The board's state (all / active / archived / deleted). */
  state: State;
  /** The board's subscribers. */
  subscribers: Array<Maybe<User>>;
  /** The board's specific tags. */
  tags?: Maybe<Array<Maybe<Tag>>>;
  /** List of team board owners */
  team_owners?: Maybe<Array<Team>>;
  /** The board's team subscribers. */
  team_subscribers?: Maybe<Array<Team>>;
  /** The top group at this board. */
  top_group: Group;
  /** The board object type. */
  type?: Maybe<BoardObjectType>;
  /** The last time the board was updated at. */
  updated_at?: Maybe<Scalars['ISO8601DateTime']['output']>;
  /** The board's updates. */
  updates?: Maybe<Array<Maybe<Update>>>;
  /** The Board's url */
  url: Scalars['String']['output'];
  /** The board's views. */
  views?: Maybe<Array<Maybe<BoardView>>>;
  /** The workspace that contains this board (null for main workspace). */
  workspace?: Maybe<Workspace>;
  /** The board's workspace unique identifier (null for main workspace). */
  workspace_id?: Maybe<Scalars['ID']['output']>;
};


/** A monday.com board. */
export type BoardActivity_LogsArgs = {
  column_ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  from?: InputMaybe<Scalars['ISO8601DateTime']['input']>;
  group_ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  item_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  to?: InputMaybe<Scalars['ISO8601DateTime']['input']>;
  user_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};


/** A monday.com board. */
export type BoardColumnsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  types?: InputMaybe<Array<ColumnType>>;
};


/** A monday.com board. */
export type BoardGroupsArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** A monday.com board. */
export type BoardItems_PageArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  query_params?: InputMaybe<ItemsQuery>;
};


/** A monday.com board. */
export type BoardTeam_OwnersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** A monday.com board. */
export type BoardTeam_SubscribersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** A monday.com board. */
export type BoardUpdatesArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** A monday.com board. */
export type BoardViewsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  type?: InputMaybe<Scalars['String']['input']>;
};

/** The board attributes available. */
export enum BoardAttributes {
  /** Object that contains available Video conferences on the board. */
  Communication = 'communication',
  /** Board description. */
  Description = 'description',
  /** Board name. */
  Name = 'name'
}

/** A board duplication */
export type BoardDuplication = {
  __typename?: 'BoardDuplication';
  /** The new board created by the duplication */
  board: Board;
  /** Was the board duplication performed asynchronously */
  is_async: Scalars['Boolean']['output'];
};

/** The board kinds available. */
export enum BoardKind {
  /** Private boards. */
  Private = 'private',
  /** Public boards. */
  Public = 'public',
  /** Shareable boards. */
  Share = 'share'
}

/** The board object types. */
export enum BoardObjectType {
  /** Parent Board. */
  Board = 'board',
  /** Custom Object. */
  CustomObject = 'custom_object',
  /** Document. */
  Document = 'document',
  /** Sub Items Board. */
  SubItemsBoard = 'sub_items_board'
}

export type BoardRelationValue = ColumnValue & {
  __typename?: 'BoardRelationValue';
  /** The column that this value belongs to. */
  column: Column;
  /** A string representing all the names of the linked items, separated by commas */
  display_value: Scalars['String']['output'];
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The linked items IDs */
  linked_item_ids: Array<Scalars['ID']['output']>;
  /** The linked items. */
  linked_items: Array<Item>;
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** The board subscriber kind. */
export enum BoardSubscriberKind {
  /** Board owner. */
  Owner = 'owner',
  /** Board subscriber. */
  Subscriber = 'subscriber'
}

/** A board's view. */
export type BoardView = {
  __typename?: 'BoardView';
  /** The view's unique identifier. */
  id: Scalars['ID']['output'];
  /** The view's name. */
  name: Scalars['String']['output'];
  /** The view's settings in a string form. */
  settings_str: Scalars['String']['output'];
  /** The view's template id if it was duplictated from other */
  source_view_id?: Maybe<Scalars['ID']['output']>;
  /** The view's type. */
  type: Scalars['String']['output'];
  /** Specific board view data (supported only for forms) */
  view_specific_data_str: Scalars['String']['output'];
};

/** Options to order by. */
export enum BoardsOrderBy {
  /** The rank order of the board creation time (desc). */
  CreatedAt = 'created_at',
  /** The last time the user making the request used the board (desc). */
  UsedAt = 'used_at'
}

export type ButtonValue = ColumnValue & {
  __typename?: 'ButtonValue';
  /** The button's color in hex value. */
  color?: Maybe<Scalars['String']['output']>;
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The button's label. */
  label?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** The result of adding users to / removing users from a team. */
export type ChangeTeamMembershipsResult = {
  __typename?: 'ChangeTeamMembershipsResult';
  /** The users that team membership update failed for */
  failed_users?: Maybe<Array<User>>;
  /** The users that team membership update succeeded for */
  successful_users?: Maybe<Array<User>>;
};

export type CheckboxValue = ColumnValue & {
  __typename?: 'CheckboxValue';
  /** The column's boolean value. */
  checked?: Maybe<Scalars['Boolean']['output']>;
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  value?: Maybe<Scalars['JSON']['output']>;
};

export type ColorPickerValue = ColumnValue & {
  __typename?: 'ColorPickerValue';
  /** The color in hex value. */
  color?: Maybe<Scalars['String']['output']>;
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type Column = {
  __typename?: 'Column';
  /** Is the column archived or not. */
  archived: Scalars['Boolean']['output'];
  /** The column's description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The column's settings in a string form. */
  settings_str: Scalars['String']['output'];
  /** The column's title. */
  title: Scalars['String']['output'];
  /** The column's type. */
  type: ColumnType;
  /** The column's width. */
  width?: Maybe<Scalars['Int']['output']>;
};

/** An object defining a mapping of column between source board and destination board */
export type ColumnMappingInput = {
  /** The source column's unique identifier. */
  source: Scalars['ID']['input'];
  /** The target column's unique identifier. */
  target?: InputMaybe<Scalars['ID']['input']>;
};

/** The property name of the column to be changed. */
export enum ColumnProperty {
  /** the column description. */
  Description = 'description',
  /** the column title. */
  Title = 'title'
}

/** The columns to create. */
export enum ColumnType {
  /** Number items according to their order in the group/board */
  AutoNumber = 'auto_number',
  /** Connect data from other boards */
  BoardRelation = 'board_relation',
  /** Perform actions on items by clicking a button */
  Button = 'button',
  /** Check off items and see what's done at a glance */
  Checkbox = 'checkbox',
  /** Manage a design system using a color palette */
  ColorPicker = 'color_picker',
  /** Choose a country */
  Country = 'country',
  /** Add the item's creator and creation date automatically */
  CreationLog = 'creation_log',
  /** Add dates like deadlines to ensure you never drop the ball */
  Date = 'date',
  /** Set up dependencies between items in the board */
  Dependency = 'dependency',
  /** Instantly add collaborative rich text editor */
  Doc = 'doc',
  /** Create a dropdown list of options */
  Dropdown = 'dropdown',
  /** Email team members and clients directly from your board */
  Email = 'email',
  /** Add files & docs to your item */
  File = 'file',
  /** Use functions to manipulate data across multiple columns */
  Formula = 'formula',
  Group = 'group',
  /** Add times to manage and schedule tasks, shifts and more */
  Hour = 'hour',
  /** Integration is really cool... */
  Integration = 'integration',
  /** Show all item's assignees */
  ItemAssignees = 'item_assignees',
  /** Show a unique ID for each item */
  ItemId = 'item_id',
  /** Add the person that last updated the item and the date */
  LastUpdated = 'last_updated',
  /** Simply hyperlink to any website */
  Link = 'link',
  /** Place multiple locations on a geographic map */
  Location = 'location',
  /** Add large amounts of text without changing column width */
  LongText = 'long_text',
  /** Show and edit columns' data from connected boards */
  Mirror = 'mirror',
  /** Name is really cool... */
  Name = 'name',
  /** Add revenue, costs, time estimations and more */
  Numbers = 'numbers',
  /** Assign people to improve team work */
  People = 'people',
  /** Assign a person to increase ownership and accountability (deprecated) */
  Person = 'person',
  /** Call your contacts directly from monday.com */
  Phone = 'phone',
  /** Show progress by combining status columns in a battery */
  Progress = 'progress',
  /** Rate or rank anything visually */
  Rating = 'rating',
  /** Get an instant overview of where things stand */
  Status = 'status',
  /** Use the subtasks column to create another level of tasks */
  Subtasks = 'subtasks',
  /** Add tags to categorize items across multiple boards */
  Tags = 'tags',
  /** Assign a full team to an item  */
  Team = 'team',
  /** Add textual information e.g. addresses, names or keywords */
  Text = 'text',
  /** Easily track time spent on each item, group, and board */
  TimeTracking = 'time_tracking',
  /** Visualize your item’s duration, with a start and end date */
  Timeline = 'timeline',
  /** Unsupported column type */
  Unsupported = 'unsupported',
  /** Vote on an item e.g. pick a new feature or a favorite lunch place */
  Vote = 'vote',
  /** Select the week on which each item should be completed */
  Week = 'week',
  /** Keep track of the time anywhere in the world */
  WorldClock = 'world_clock'
}

export type ColumnValue = {
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** Complexity data. */
export type Complexity = {
  __typename?: 'Complexity';
  /** The remainder of complexity after the query's execution. */
  after: Scalars['Int']['output'];
  /** The remainder of complexity before the query's execution. */
  before: Scalars['Int']['output'];
  /** The specific query's complexity. */
  query: Scalars['Int']['output'];
  /** How long in seconds before the complexity budget is reset */
  reset_in_x_seconds: Scalars['Int']['output'];
};

export type Country = {
  __typename?: 'Country';
  /** The country's two-letter code. */
  code: Scalars['String']['output'];
  /** The country's name. */
  name: Scalars['String']['output'];
};

export type CountryValue = ColumnValue & {
  __typename?: 'CountryValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The country value. */
  country?: Maybe<Country>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type CreationLogValue = ColumnValue & {
  __typename?: 'CreationLogValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The date when the item was created. */
  created_at: Scalars['Date']['output'];
  /** User who created the item */
  creator: User;
  /** ID of the user who created the item */
  creator_id: Scalars['ID']['output'];
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type DateValue = ColumnValue & {
  __typename?: 'DateValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's date value. */
  date?: Maybe<Scalars['String']['output']>;
  /** The string representation of selected icon. */
  icon?: Maybe<Scalars['String']['output']>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The formatted date and time in user time zone. */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's time value. */
  time?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type DependencyValue = ColumnValue & {
  __typename?: 'DependencyValue';
  /** The column that this value belongs to. */
  column: Column;
  /** A string representing all the names of the linked items, separated by commas */
  display_value: Scalars['String']['output'];
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The linked items ids */
  linked_item_ids: Scalars['ID']['output'];
  /** The linked items. */
  linked_items: Array<Item>;
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** Various documents blocks types, such as text. */
export enum DocBlockContentType {
  /** Bulleted list block */
  BulletedList = 'bulleted_list',
  /** Check list block */
  CheckList = 'check_list',
  /** Code block */
  Code = 'code',
  /** Divider block */
  Divider = 'divider',
  /** Image block */
  Image = 'image',
  /** Large title block */
  LargeTitle = 'large_title',
  /** Layout block */
  Layout = 'layout',
  /** Medium title block */
  MediumTitle = 'medium_title',
  /** Simple text block */
  NormalText = 'normal_text',
  /** Notice block */
  NoticeBox = 'notice_box',
  /** Numbered list block */
  NumberedList = 'numbered_list',
  /** Quote text block */
  Quote = 'quote',
  /** Small title block */
  SmallTitle = 'small_title',
  /** Table block */
  Table = 'table',
  /** Video block */
  Video = 'video'
}

export type DocValue = ColumnValue & {
  __typename?: 'DocValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The document file attached to the column. */
  file?: Maybe<FileDocValue>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** Options to order by. */
export enum DocsOrderBy {
  /** The rank order of the document creation time (desc). */
  CreatedAt = 'created_at',
  /** The last time the user making the request viewd the document (desc). */
  UsedAt = 'used_at'
}

/** A monday.com document. */
export type Document = {
  __typename?: 'Document';
  /** The document's content blocks */
  blocks?: Maybe<Array<Maybe<DocumentBlock>>>;
  /** The document's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The document's creator */
  created_by?: Maybe<User>;
  /** The document's folder unique identifier (null for first level). */
  doc_folder_id?: Maybe<Scalars['ID']['output']>;
  /** The document's kind (public / private / share). */
  doc_kind: BoardKind;
  /** The document's unique identifier. */
  id: Scalars['ID']['output'];
  /** The document's name. */
  name: Scalars['String']['output'];
  /** The associated board or object's unique identifier. */
  object_id: Scalars['ID']['output'];
  /** The document's relative url */
  relative_url?: Maybe<Scalars['String']['output']>;
  /** The document's settings. */
  settings?: Maybe<Scalars['JSON']['output']>;
  /** The document's direct url */
  url?: Maybe<Scalars['String']['output']>;
  /** The workspace that contains this document (null for main workspace). */
  workspace?: Maybe<Workspace>;
  /** The document's workspace unique identifier (null for main workspace). */
  workspace_id?: Maybe<Scalars['ID']['output']>;
};


/** A monday.com document. */
export type DocumentBlocksArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** A monday.com document block. */
export type DocumentBlock = {
  __typename?: 'DocumentBlock';
  /** The block's content. */
  content?: Maybe<Scalars['JSON']['output']>;
  /** The block's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The block's creator */
  created_by?: Maybe<User>;
  /** The block's document unique identifier. */
  doc_id?: Maybe<Scalars['ID']['output']>;
  /** The block's unique identifier. */
  id: Scalars['String']['output'];
  /** The block's parent block unique identifier. */
  parent_block_id?: Maybe<Scalars['String']['output']>;
  /** The block's position on the document. */
  position?: Maybe<Scalars['Float']['output']>;
  /** The block content type. */
  type?: Maybe<Scalars['String']['output']>;
  /** The block's last updated date. */
  updated_at?: Maybe<Scalars['Date']['output']>;
};

/** A monday.com doc block. */
export type DocumentBlockIdOnly = {
  __typename?: 'DocumentBlockIdOnly';
  /** The block's unique identifier. */
  id: Scalars['String']['output'];
};

export type DropdownValue = ColumnValue & {
  __typename?: 'DropdownValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
  /** The selected dropdown values. */
  values: Array<DropdownValueOption>;
};

export type DropdownValueOption = {
  __typename?: 'DropdownValueOption';
  /** The dropdown item's unique identifier. */
  id: Scalars['ID']['output'];
  /** The dropdown item's label. */
  label: Scalars['String']['output'];
};

/** The board duplicate types available. */
export enum DuplicateBoardType {
  /** Duplicate board with structure and items. */
  DuplicateBoardWithPulses = 'duplicate_board_with_pulses',
  /** Duplicate board with structure, items and updates. */
  DuplicateBoardWithPulsesAndUpdates = 'duplicate_board_with_pulses_and_updates',
  /** Duplicate board with structure. */
  DuplicateBoardWithStructure = 'duplicate_board_with_structure'
}

export type EmailValue = ColumnValue & {
  __typename?: 'EmailValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's email value. */
  email?: Maybe<Scalars['String']['output']>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The column's text value. It can be the same as email when user didn't enter any text. */
  label?: Maybe<Scalars['String']['output']>;
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** Result of a single operation */
export type ExtendTrialPeriod = {
  __typename?: 'ExtendTrialPeriod';
  /** Account slug */
  account_slug: Scalars['String']['output'];
  /** Reason of an error */
  reason?: Maybe<Scalars['String']['output']>;
  /** Result of a single operation */
  success: Scalars['Boolean']['output'];
};

export type FileAssetValue = {
  __typename?: 'FileAssetValue';
  /** The asset associated with the file. */
  asset: Asset;
  /** The asset's id. */
  asset_id: Scalars['ID']['output'];
  /** The file's creation date. */
  created_at: Scalars['Date']['output'];
  /** The user who created the file. */
  creator?: Maybe<User>;
  /** The ID of user who created the file. */
  creator_id?: Maybe<Scalars['ID']['output']>;
  /** Whether the file is an image. */
  is_image: Scalars['Boolean']['output'];
  /** The file's name. */
  name: Scalars['String']['output'];
};

export type FileDocValue = {
  __typename?: 'FileDocValue';
  /** The file's creation date. */
  created_at: Scalars['Date']['output'];
  /** The user who created the file. */
  creator?: Maybe<User>;
  /** The ID of user who created the file. */
  creator_id?: Maybe<Scalars['ID']['output']>;
  /** The doc associated with the file. */
  doc: Document;
  /** The file's unique identifier. */
  file_id: Scalars['ID']['output'];
  /** The associated board or object's unique identifier. */
  object_id: Scalars['ID']['output'];
  /** The file's url. */
  url?: Maybe<Scalars['String']['output']>;
};

export type FileLinkValue = {
  __typename?: 'FileLinkValue';
  /** The file's creation date. */
  created_at: Scalars['Date']['output'];
  /** The user who created the file. */
  creator?: Maybe<User>;
  /** The ID of user who created the file. */
  creator_id?: Maybe<Scalars['ID']['output']>;
  /** The file's id. */
  file_id: Scalars['ID']['output'];
  /** The file's kind. */
  kind: FileLinkValueKind;
  /** The file's name. */
  name: Scalars['String']['output'];
  /** The file's url. */
  url?: Maybe<Scalars['String']['output']>;
};

/** The type of a link value stored inside a file column */
export enum FileLinkValueKind {
  /** Box file */
  Box = 'box',
  /** Dropbox file */
  Dropbox = 'dropbox',
  /** Google Drive file */
  GoogleDrive = 'google_drive',
  /** Generic link file */
  Link = 'link',
  /** OneDrive file */
  Onedrive = 'onedrive'
}

export type FileValue = ColumnValue & {
  __typename?: 'FileValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The files attached to the column. */
  files: Array<FileValueItem>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** A single file in a column. */
export type FileValueItem = FileAssetValue | FileDocValue | FileLinkValue;

/** The first day of work week */
export enum FirstDayOfTheWeek {
  /** Monday */
  Monday = 'monday',
  /** Sunday */
  Sunday = 'sunday'
}

/** A workspace folder containing boards, docs, sub folders, etc. */
export type Folder = {
  __typename?: 'Folder';
  /** The various items in the folder, not including sub-folders and dashboards. */
  children: Array<Maybe<Board>>;
  /** The folder's color. */
  color?: Maybe<FolderColor>;
  /** The folder's creation date. */
  created_at: Scalars['Date']['output'];
  /** The folder's custom icon. */
  custom_icon?: Maybe<FolderCustomIcon>;
  /** The folder's font weight. */
  font_weight?: Maybe<FolderFontWeight>;
  /** The folder's unique identifier. */
  id: Scalars['ID']['output'];
  /** The folder's name. */
  name: Scalars['String']['output'];
  /** The folder's user owner unique identifier. */
  owner_id?: Maybe<Scalars['ID']['output']>;
  /** The folder's parent folder. */
  parent?: Maybe<Folder>;
  /** Sub-folders inside this folder. */
  sub_folders: Array<Maybe<Folder>>;
  /** The workspace that contains this folder (null id for main workspace). */
  workspace: Workspace;
};

/** One value out of a list of valid folder colors */
export enum FolderColor {
  /** aquamarine */
  Aquamarine = 'AQUAMARINE',
  /** bright-blue */
  BrightBlue = 'BRIGHT_BLUE',
  /** bright-green */
  BrightGreen = 'BRIGHT_GREEN',
  /** chili-blue */
  ChiliBlue = 'CHILI_BLUE',
  /** dark-orange */
  DarkOrange = 'DARK_ORANGE',
  /** dark_purple */
  DarkPurple = 'DARK_PURPLE',
  /** dark-red */
  DarkRed = 'DARK_RED',
  /** done-green */
  DoneGreen = 'DONE_GREEN',
  /** indigo */
  Indigo = 'INDIGO',
  /** lipstick */
  Lipstick = 'LIPSTICK',
  /** No color */
  Null = 'NULL',
  /** purple */
  Purple = 'PURPLE',
  /** sofia_pink */
  SofiaPink = 'SOFIA_PINK',
  /** stuck-red */
  StuckRed = 'STUCK_RED',
  /** sunset */
  Sunset = 'SUNSET',
  /** working_orange */
  WorkingOrange = 'WORKING_ORANGE'
}

/** One value out of a list of valid folder custom icons */
export enum FolderCustomIcon {
  /** Folder */
  Folder = 'FOLDER',
  /** MoreBelow */
  Morebelow = 'MOREBELOW',
  /** MoreBelowFilled */
  Morebelowfilled = 'MOREBELOWFILLED',
  /** No custom icon */
  Null = 'NULL',
  /** Work */
  Work = 'WORK'
}

/** One value out of a list of valid folder font weights */
export enum FolderFontWeight {
  /** font-weight-bold */
  FontWeightBold = 'FONT_WEIGHT_BOLD',
  /** font-weight-light */
  FontWeightLight = 'FONT_WEIGHT_LIGHT',
  /** font-weight-normal */
  FontWeightNormal = 'FONT_WEIGHT_NORMAL',
  /** font-weight-very-light */
  FontWeightVeryLight = 'FONT_WEIGHT_VERY_LIGHT',
  /** No font weight */
  Null = 'NULL'
}

export type FormulaValue = ColumnValue & {
  __typename?: 'FormulaValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** A group of items in a board. */
export type Group = {
  __typename?: 'Group';
  /** Is the group archived or not. */
  archived?: Maybe<Scalars['Boolean']['output']>;
  /** The group's color. */
  color: Scalars['String']['output'];
  /** Is the group deleted or not. */
  deleted?: Maybe<Scalars['Boolean']['output']>;
  /** The group's unique identifier. */
  id: Scalars['ID']['output'];
  /** The items in the group. */
  items_page: ItemsResponse;
  /** The group's position in the board. */
  position: Scalars['String']['output'];
  /** The group's title. */
  title: Scalars['String']['output'];
};


/** A group of items in a board. */
export type GroupItems_PageArgs = {
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
  query_params?: InputMaybe<ItemsQuery>;
};

/** The group attributes available. */
export enum GroupAttributes {
  /** Group color (one of the supported colors, check the API documentation). */
  Color = 'color',
  /** The group's position in the board. Deprecated! - replaced with relative position */
  Position = 'position',
  /** The group's relative position after another group in the board. */
  RelativePositionAfter = 'relative_position_after',
  /** The group's relative position before another group in the board. */
  RelativePositionBefore = 'relative_position_before',
  /** Group title. */
  Title = 'title'
}

export type GroupValue = ColumnValue & {
  __typename?: 'GroupValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The group value. */
  group?: Maybe<Group>;
  /** The group identifier. */
  group_id?: Maybe<Scalars['ID']['output']>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type HourValue = ColumnValue & {
  __typename?: 'HourValue';
  /** The column that this value belongs to. */
  column: Column;
  /** Hour */
  hour?: Maybe<Scalars['Int']['output']>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Minute */
  minute?: Maybe<Scalars['Int']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type IntegrationValue = ColumnValue & {
  __typename?: 'IntegrationValue';
  /** The column that this value belongs to. */
  column: Column;
  /** ID of the entity */
  entity_id?: Maybe<Scalars['ID']['output']>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** URL of the issue */
  issue_api_url?: Maybe<Scalars['ID']['output']>;
  /** ID of the issue */
  issue_id?: Maybe<Scalars['String']['output']>;
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** An item (table row). */
export type Item = {
  __typename?: 'Item';
  /** The item's assets/files. */
  assets?: Maybe<Array<Maybe<Asset>>>;
  /** The board that contains this item. */
  board?: Maybe<Board>;
  /** The item's column values. */
  column_values: Array<ColumnValue>;
  /** The item's create date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The item's creator. */
  creator?: Maybe<User>;
  /** The unique identifier of the item creator. */
  creator_id: Scalars['String']['output'];
  /** The item's email. */
  email: Scalars['String']['output'];
  /** The group that contains this item. */
  group?: Maybe<Group>;
  /** The item's unique identifier. */
  id: Scalars['ID']['output'];
  /** The item's linked items */
  linked_items: Array<Item>;
  /** The item's name. */
  name: Scalars['String']['output'];
  /** The parent item of a subitem. */
  parent_item?: Maybe<Item>;
  /** The item's relative path */
  relative_link?: Maybe<Scalars['String']['output']>;
  /** The item's state (all / active / archived / deleted). */
  state?: Maybe<State>;
  /** The item's subitems. */
  subitems?: Maybe<Array<Maybe<Item>>>;
  /** The pulses's subscribers. */
  subscribers: Array<Maybe<User>>;
  /** The item's last update date. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The item's updates. */
  updates?: Maybe<Array<Maybe<Update>>>;
  /** The item's link */
  url: Scalars['String']['output'];
};


/** An item (table row). */
export type ItemAssetsArgs = {
  assets_source?: InputMaybe<AssetsSource>;
  column_ids?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** An item (table row). */
export type ItemColumn_ValuesArgs = {
  ids?: InputMaybe<Array<Scalars['String']['input']>>;
  types?: InputMaybe<Array<ColumnType>>;
};


/** An item (table row). */
export type ItemLinked_ItemsArgs = {
  link_to_item_column_id: Scalars['String']['input'];
  linked_board_id: Scalars['ID']['input'];
};


/** An item (table row). */
export type ItemUpdatesArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type ItemIdValue = ColumnValue & {
  __typename?: 'ItemIdValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** ID of the item */
  item_id: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** The direction to order the items by */
export enum ItemsOrderByDirection {
  /** Ascending order */
  Asc = 'asc',
  /** Descending order */
  Desc = 'desc'
}

export type ItemsPageByColumnValuesQuery = {
  /** The column's unique identifier. */
  column_id: Scalars['String']['input'];
  /** The column values to search items by. */
  column_values: Array<InputMaybe<Scalars['String']['input']>>;
};

export type ItemsQuery = {
  /** A list of rule groups */
  groups?: InputMaybe<Array<ItemsQueryGroup>>;
  /** A list of item IDs to fetch. Use this to fetch a specific set of items by their IDs. Max: 100 IDs */
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  /** The operator to use for the query rules or rule groups */
  operator?: InputMaybe<ItemsQueryOperator>;
  order_by?: InputMaybe<Array<ItemsQueryOrderBy>>;
  /** A list of rules */
  rules?: InputMaybe<Array<ItemsQueryRule>>;
};

export type ItemsQueryGroup = {
  /** A list of rule groups */
  groups?: InputMaybe<Array<ItemsQueryGroup>>;
  /** The operator to use for the query rules or rule groups */
  operator?: InputMaybe<ItemsQueryOperator>;
  /** A list of rules */
  rules?: InputMaybe<Array<ItemsQueryRule>>;
};

/** The condition between the query rules */
export enum ItemsQueryOperator {
  /** Logical AND */
  And = 'and',
  /** Logical OR */
  Or = 'or'
}

export type ItemsQueryOrderBy = {
  column_id: Scalars['String']['input'];
  direction?: InputMaybe<ItemsOrderByDirection>;
};

export type ItemsQueryRule = {
  column_id: Scalars['ID']['input'];
  compare_attribute?: InputMaybe<Scalars['String']['input']>;
  compare_value: Scalars['CompareValue']['input'];
  operator?: InputMaybe<ItemsQueryRuleOperator>;
};

/** The operator to use for the value comparison */
export enum ItemsQueryRuleOperator {
  /** Any of the values */
  AnyOf = 'any_of',
  /** Between the two values */
  Between = 'between',
  /** Contains all the terms */
  ContainsTerms = 'contains_terms',
  /** Contains the text */
  ContainsText = 'contains_text',
  /** Ends with the value */
  EndsWith = 'ends_with',
  /** Greater than the value */
  GreaterThan = 'greater_than',
  /** Greater than or equal to the value */
  GreaterThanOrEquals = 'greater_than_or_equals',
  /** Empty value */
  IsEmpty = 'is_empty',
  /** Not empty value */
  IsNotEmpty = 'is_not_empty',
  /** Lower than the value */
  LowerThan = 'lower_than',
  /** Lower than or equal to the value */
  LowerThanOrEqual = 'lower_than_or_equal',
  /** None of the values */
  NotAnyOf = 'not_any_of',
  /** Does not contain the text */
  NotContainsText = 'not_contains_text',
  /** Starts with the value */
  StartsWith = 'starts_with',
  /** Within the last */
  WithinTheLast = 'within_the_last',
  /** Within the next  */
  WithinTheNext = 'within_the_next'
}

export type ItemsResponse = {
  __typename?: 'ItemsResponse';
  /**
   * An opaque cursor that represents the position in the list after the last
   * returned item. Use this cursor for pagination to fetch the next set of items.
   * If the cursor is null, there are no more items to fetch.
   */
  cursor?: Maybe<Scalars['String']['output']>;
  /** The items associated with the cursor. */
  items: Array<Item>;
};

/** Kind of assignee */
export enum Kind {
  /** Represents a person */
  Person = 'person',
  /** Represents a team */
  Team = 'team'
}

export type LastUpdatedValue = ColumnValue & {
  __typename?: 'LastUpdatedValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** Timestamp of the last time the item was updated */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** User who updated the item */
  updater?: Maybe<User>;
  /** ID of the user who updated the item */
  updater_id?: Maybe<Scalars['ID']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type LinkValue = ColumnValue & {
  __typename?: 'LinkValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** Url */
  url?: Maybe<Scalars['String']['output']>;
  /** Url text */
  url_text?: Maybe<Scalars['String']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type LocationValue = ColumnValue & {
  __typename?: 'LocationValue';
  /** Address */
  address?: Maybe<Scalars['String']['output']>;
  /** City */
  city?: Maybe<Scalars['String']['output']>;
  /** City */
  city_short?: Maybe<Scalars['String']['output']>;
  /** The column that this value belongs to. */
  column: Column;
  /** Country */
  country?: Maybe<Scalars['String']['output']>;
  /** Country short name (e.g. PE for Peru) */
  country_short?: Maybe<Scalars['String']['output']>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Latitude */
  lat?: Maybe<Scalars['Float']['output']>;
  /** Longitude */
  lng?: Maybe<Scalars['Float']['output']>;
  /** Place ID of the location */
  place_id?: Maybe<Scalars['String']['output']>;
  /** Street */
  street?: Maybe<Scalars['String']['output']>;
  /** Number of building in the street */
  street_number?: Maybe<Scalars['String']['output']>;
  /** Short number of building in the street */
  street_number_short?: Maybe<Scalars['String']['output']>;
  /** Street */
  street_short?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type LongTextValue = ColumnValue & {
  __typename?: 'LongTextValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type MirrorValue = ColumnValue & {
  __typename?: 'MirrorValue';
  /** The column that this value belongs to. */
  column: Column;
  /** A string representing all the names of the linked items, separated by commas */
  display_value: Scalars['String']['output'];
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The mirrored items. */
  mirrored_items: Array<MirroredItem>;
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type MirroredItem = {
  __typename?: 'MirroredItem';
  /** The linked board. */
  linked_board: Board;
  /** The linked board's unique identifier. */
  linked_board_id: Scalars['ID']['output'];
  /** The linked item. */
  linked_item: Item;
  /** The mirrored values. */
  mirrored_value?: Maybe<MirroredValue>;
};

/** Represents a mirrored value (column value, group, or board). */
export type MirroredValue = Board | BoardRelationValue | ButtonValue | CheckboxValue | ColorPickerValue | CountryValue | CreationLogValue | DateValue | DependencyValue | DocValue | DropdownValue | EmailValue | FileValue | FormulaValue | Group | GroupValue | HourValue | IntegrationValue | ItemIdValue | LastUpdatedValue | LinkValue | LocationValue | LongTextValue | MirrorValue | NumbersValue | PeopleValue | PersonValue | PhoneValue | ProgressValue | RatingValue | StatusValue | SubtasksValue | TagsValue | TeamValue | TextValue | TimeTrackingValue | TimelineValue | UnsupportedValue | VoteValue | WeekValue | WorldClockValue;

/** Update your monday.com data. */
export type Mutation = {
  __typename?: 'Mutation';
  /** Add a file to a column value. */
  add_file_to_column?: Maybe<Asset>;
  /** Add a file to an update. */
  add_file_to_update?: Maybe<Asset>;
  /**
   * Add subscribers to a board.
   * @deprecated use add_users_to_board instead
   */
  add_subscribers_to_board?: Maybe<Array<Maybe<User>>>;
  /** Add teams subscribers to a board. */
  add_teams_to_board?: Maybe<Array<Maybe<Team>>>;
  /** Add teams to a workspace. */
  add_teams_to_workspace?: Maybe<Array<Maybe<Team>>>;
  /** Add subscribers to a board. */
  add_users_to_board?: Maybe<Array<Maybe<User>>>;
  /** Add users to team. */
  add_users_to_team?: Maybe<ChangeTeamMembershipsResult>;
  /** Add users to a workspace. */
  add_users_to_workspace?: Maybe<Array<Maybe<User>>>;
  /** Archive a board. */
  archive_board?: Maybe<Board>;
  /** Archives a group in a specific board. */
  archive_group?: Maybe<Group>;
  /** Archive an item. */
  archive_item?: Maybe<Item>;
  /** Extends trial period of an application to selected accounts */
  batch_extend_trial_period?: Maybe<BatchExtendTrialPeriod>;
  /** Change a column's properties */
  change_column_metadata?: Maybe<Column>;
  /** Change a column's title */
  change_column_title?: Maybe<Column>;
  /** Change an item's column value. */
  change_column_value?: Maybe<Item>;
  /** Changes the column values of a specific item. */
  change_multiple_column_values?: Maybe<Item>;
  /** Change an item's column with simple value. */
  change_simple_column_value?: Maybe<Item>;
  /** Clear an item's updates. */
  clear_item_updates?: Maybe<Item>;
  /** Get the complexity data of your mutations. */
  complexity?: Maybe<Complexity>;
  /** Create a new board. */
  create_board?: Maybe<Board>;
  /** Create a new column in board. */
  create_column?: Maybe<Column>;
  /** Create new document block */
  create_doc_block?: Maybe<DocumentBlock>;
  /** Creates a folder in a specific workspace. */
  create_folder?: Maybe<Folder>;
  /** Creates a new group in a specific board. */
  create_group?: Maybe<Group>;
  /** Create a new item. */
  create_item?: Maybe<Item>;
  /** Create a new notification. */
  create_notification?: Maybe<Notification>;
  /** Create a new tag or get it if it already exists. */
  create_or_get_tag?: Maybe<Tag>;
  /** Create subitem. */
  create_subitem?: Maybe<Item>;
  /** Create a new update. */
  create_update?: Maybe<Update>;
  /** Create a new webhook. */
  create_webhook?: Maybe<Webhook>;
  /** Create a new workspace. */
  create_workspace?: Maybe<Workspace>;
  /** Delete a board. */
  delete_board?: Maybe<Board>;
  /** Delete a column. */
  delete_column?: Maybe<Column>;
  /** Delete a document block */
  delete_doc_block?: Maybe<DocumentBlockIdOnly>;
  /** Deletes a folder in a specific workspace. */
  delete_folder?: Maybe<Folder>;
  /** Deletes a group in a specific board. */
  delete_group?: Maybe<Group>;
  /** Delete an item. */
  delete_item?: Maybe<Item>;
  /** Remove subscribers from the board. */
  delete_subscribers_from_board?: Maybe<Array<Maybe<User>>>;
  /** Remove team subscribers from the board. */
  delete_teams_from_board?: Maybe<Array<Maybe<Team>>>;
  /** Delete teams from a workspace. */
  delete_teams_from_workspace?: Maybe<Array<Maybe<Team>>>;
  /** Delete an update. */
  delete_update?: Maybe<Update>;
  /** Delete users from a workspace. */
  delete_users_from_workspace?: Maybe<Array<Maybe<User>>>;
  /** Delete a new webhook. */
  delete_webhook?: Maybe<Webhook>;
  /** Delete workspace. */
  delete_workspace?: Maybe<Workspace>;
  /** Duplicate a board. */
  duplicate_board?: Maybe<BoardDuplication>;
  /** Duplicate a group. */
  duplicate_group?: Maybe<Group>;
  /** Duplicate an item. */
  duplicate_item?: Maybe<Item>;
  /** Increase operations counter */
  increase_app_subscription_operations?: Maybe<AppSubscriptionOperationsCounter>;
  /** Like an update. */
  like_update?: Maybe<Update>;
  /** Move an item to a different board. */
  move_item_to_board?: Maybe<Item>;
  /** Move an item to a different group. */
  move_item_to_group?: Maybe<Item>;
  /** Remove mock app subscription for the current account */
  remove_mock_app_subscription?: Maybe<AppSubscription>;
  /** Remove users from team. */
  remove_users_from_team?: Maybe<ChangeTeamMembershipsResult>;
  /** Set mock app subscription for the current account */
  set_mock_app_subscription?: Maybe<AppSubscription>;
  /** Update Board attribute. */
  update_board?: Maybe<Scalars['JSON']['output']>;
  /** Update a document block */
  update_doc_block?: Maybe<DocumentBlock>;
  /** Updates a folder. */
  update_folder?: Maybe<Folder>;
  /** Update an existing group. */
  update_group?: Maybe<Group>;
  /** Update an existing workspace. */
  update_workspace?: Maybe<Workspace>;
  /** Use a template */
  use_template?: Maybe<Template>;
};


/** Update your monday.com data. */
export type MutationAdd_File_To_ColumnArgs = {
  column_id: Scalars['String']['input'];
  file: Scalars['File']['input'];
  item_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationAdd_File_To_UpdateArgs = {
  file: Scalars['File']['input'];
  update_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationAdd_Subscribers_To_BoardArgs = {
  board_id: Scalars['ID']['input'];
  kind?: InputMaybe<BoardSubscriberKind>;
  user_ids: Array<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationAdd_Teams_To_BoardArgs = {
  board_id: Scalars['ID']['input'];
  kind?: InputMaybe<BoardSubscriberKind>;
  team_ids: Array<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationAdd_Teams_To_WorkspaceArgs = {
  kind?: InputMaybe<WorkspaceSubscriberKind>;
  team_ids: Array<Scalars['ID']['input']>;
  workspace_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationAdd_Users_To_BoardArgs = {
  board_id: Scalars['ID']['input'];
  kind?: InputMaybe<BoardSubscriberKind>;
  user_ids: Array<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationAdd_Users_To_TeamArgs = {
  team_id: Scalars['ID']['input'];
  user_ids: Array<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationAdd_Users_To_WorkspaceArgs = {
  kind?: InputMaybe<WorkspaceSubscriberKind>;
  user_ids: Array<Scalars['ID']['input']>;
  workspace_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationArchive_BoardArgs = {
  board_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationArchive_GroupArgs = {
  board_id: Scalars['ID']['input'];
  group_id: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationArchive_ItemArgs = {
  item_id?: InputMaybe<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationBatch_Extend_Trial_PeriodArgs = {
  account_slugs: Array<Scalars['String']['input']>;
  app_id: Scalars['ID']['input'];
  duration_in_days: Scalars['Int']['input'];
  plan_id: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationChange_Column_MetadataArgs = {
  board_id: Scalars['ID']['input'];
  column_id: Scalars['String']['input'];
  column_property?: InputMaybe<ColumnProperty>;
  value?: InputMaybe<Scalars['String']['input']>;
};


/** Update your monday.com data. */
export type MutationChange_Column_TitleArgs = {
  board_id: Scalars['ID']['input'];
  column_id: Scalars['String']['input'];
  title: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationChange_Column_ValueArgs = {
  board_id: Scalars['ID']['input'];
  column_id: Scalars['String']['input'];
  create_labels_if_missing?: InputMaybe<Scalars['Boolean']['input']>;
  item_id?: InputMaybe<Scalars['ID']['input']>;
  value: Scalars['JSON']['input'];
};


/** Update your monday.com data. */
export type MutationChange_Multiple_Column_ValuesArgs = {
  board_id: Scalars['ID']['input'];
  column_values: Scalars['JSON']['input'];
  create_labels_if_missing?: InputMaybe<Scalars['Boolean']['input']>;
  item_id?: InputMaybe<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationChange_Simple_Column_ValueArgs = {
  board_id: Scalars['ID']['input'];
  column_id: Scalars['String']['input'];
  create_labels_if_missing?: InputMaybe<Scalars['Boolean']['input']>;
  item_id?: InputMaybe<Scalars['ID']['input']>;
  value?: InputMaybe<Scalars['String']['input']>;
};


/** Update your monday.com data. */
export type MutationClear_Item_UpdatesArgs = {
  item_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationCreate_BoardArgs = {
  board_kind: BoardKind;
  board_name: Scalars['String']['input'];
  board_owner_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  board_owner_team_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  board_subscriber_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  board_subscriber_teams_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  description?: InputMaybe<Scalars['String']['input']>;
  empty?: InputMaybe<Scalars['Boolean']['input']>;
  folder_id?: InputMaybe<Scalars['ID']['input']>;
  template_id?: InputMaybe<Scalars['ID']['input']>;
  workspace_id?: InputMaybe<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationCreate_ColumnArgs = {
  after_column_id?: InputMaybe<Scalars['ID']['input']>;
  board_id: Scalars['ID']['input'];
  column_type: ColumnType;
  defaults?: InputMaybe<Scalars['JSON']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  title: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationCreate_Doc_BlockArgs = {
  after_block_id?: InputMaybe<Scalars['String']['input']>;
  content: Scalars['JSON']['input'];
  doc_id: Scalars['ID']['input'];
  parent_block_id?: InputMaybe<Scalars['String']['input']>;
  type: DocBlockContentType;
};


/** Update your monday.com data. */
export type MutationCreate_FolderArgs = {
  color?: InputMaybe<FolderColor>;
  custom_icon?: InputMaybe<FolderCustomIcon>;
  font_weight?: InputMaybe<FolderFontWeight>;
  name: Scalars['String']['input'];
  parent_folder_id?: InputMaybe<Scalars['ID']['input']>;
  workspace_id?: InputMaybe<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationCreate_GroupArgs = {
  board_id: Scalars['ID']['input'];
  group_color?: InputMaybe<Scalars['String']['input']>;
  group_name: Scalars['String']['input'];
  position?: InputMaybe<Scalars['String']['input']>;
  position_relative_method?: InputMaybe<PositionRelative>;
  relative_to?: InputMaybe<Scalars['String']['input']>;
};


/** Update your monday.com data. */
export type MutationCreate_ItemArgs = {
  board_id: Scalars['ID']['input'];
  column_values?: InputMaybe<Scalars['JSON']['input']>;
  create_labels_if_missing?: InputMaybe<Scalars['Boolean']['input']>;
  group_id?: InputMaybe<Scalars['String']['input']>;
  item_name: Scalars['String']['input'];
  position_relative_method?: InputMaybe<PositionRelative>;
  relative_to?: InputMaybe<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationCreate_NotificationArgs = {
  target_id: Scalars['ID']['input'];
  target_type: NotificationTargetType;
  text: Scalars['String']['input'];
  user_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationCreate_Or_Get_TagArgs = {
  board_id?: InputMaybe<Scalars['ID']['input']>;
  tag_name?: InputMaybe<Scalars['String']['input']>;
};


/** Update your monday.com data. */
export type MutationCreate_SubitemArgs = {
  column_values?: InputMaybe<Scalars['JSON']['input']>;
  create_labels_if_missing?: InputMaybe<Scalars['Boolean']['input']>;
  item_name: Scalars['String']['input'];
  parent_item_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationCreate_UpdateArgs = {
  body: Scalars['String']['input'];
  item_id?: InputMaybe<Scalars['ID']['input']>;
  parent_id?: InputMaybe<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationCreate_WebhookArgs = {
  board_id: Scalars['ID']['input'];
  config?: InputMaybe<Scalars['JSON']['input']>;
  event: WebhookEventType;
  url: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationCreate_WorkspaceArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  kind: WorkspaceKind;
  name: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_BoardArgs = {
  board_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_ColumnArgs = {
  board_id: Scalars['ID']['input'];
  column_id: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_Doc_BlockArgs = {
  block_id: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_FolderArgs = {
  folder_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_GroupArgs = {
  board_id: Scalars['ID']['input'];
  group_id: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_ItemArgs = {
  item_id?: InputMaybe<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationDelete_Subscribers_From_BoardArgs = {
  board_id: Scalars['ID']['input'];
  user_ids: Array<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationDelete_Teams_From_BoardArgs = {
  board_id: Scalars['ID']['input'];
  team_ids: Array<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationDelete_Teams_From_WorkspaceArgs = {
  team_ids: Array<Scalars['ID']['input']>;
  workspace_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_UpdateArgs = {
  id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_Users_From_WorkspaceArgs = {
  user_ids: Array<Scalars['ID']['input']>;
  workspace_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_WebhookArgs = {
  id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationDelete_WorkspaceArgs = {
  workspace_id: Scalars['ID']['input'];
};


/** Update your monday.com data. */
export type MutationDuplicate_BoardArgs = {
  board_id: Scalars['ID']['input'];
  board_name?: InputMaybe<Scalars['String']['input']>;
  duplicate_type: DuplicateBoardType;
  folder_id?: InputMaybe<Scalars['ID']['input']>;
  keep_subscribers?: InputMaybe<Scalars['Boolean']['input']>;
  workspace_id?: InputMaybe<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationDuplicate_GroupArgs = {
  add_to_top?: InputMaybe<Scalars['Boolean']['input']>;
  board_id: Scalars['ID']['input'];
  group_id: Scalars['String']['input'];
  group_title?: InputMaybe<Scalars['String']['input']>;
};


/** Update your monday.com data. */
export type MutationDuplicate_ItemArgs = {
  board_id: Scalars['ID']['input'];
  item_id?: InputMaybe<Scalars['ID']['input']>;
  with_updates?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Update your monday.com data. */
export type MutationIncrease_App_Subscription_OperationsArgs = {
  increment_by?: InputMaybe<Scalars['Int']['input']>;
  kind?: InputMaybe<Scalars['String']['input']>;
};


/** Update your monday.com data. */
export type MutationLike_UpdateArgs = {
  update_id?: InputMaybe<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationMove_Item_To_BoardArgs = {
  board_id: Scalars['ID']['input'];
  columns_mapping?: InputMaybe<Array<ColumnMappingInput>>;
  group_id: Scalars['ID']['input'];
  item_id: Scalars['ID']['input'];
  subitems_columns_mapping?: InputMaybe<Array<ColumnMappingInput>>;
};


/** Update your monday.com data. */
export type MutationMove_Item_To_GroupArgs = {
  group_id: Scalars['String']['input'];
  item_id?: InputMaybe<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationRemove_Mock_App_SubscriptionArgs = {
  app_id: Scalars['ID']['input'];
  partial_signing_secret: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationRemove_Users_From_TeamArgs = {
  team_id: Scalars['ID']['input'];
  user_ids: Array<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationSet_Mock_App_SubscriptionArgs = {
  app_id: Scalars['ID']['input'];
  billing_period?: InputMaybe<Scalars['String']['input']>;
  is_trial?: InputMaybe<Scalars['Boolean']['input']>;
  partial_signing_secret: Scalars['String']['input'];
  plan_id?: InputMaybe<Scalars['String']['input']>;
  pricing_version?: InputMaybe<Scalars['Int']['input']>;
  renewal_date?: InputMaybe<Scalars['Date']['input']>;
};


/** Update your monday.com data. */
export type MutationUpdate_BoardArgs = {
  board_attribute: BoardAttributes;
  board_id: Scalars['ID']['input'];
  new_value: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationUpdate_Doc_BlockArgs = {
  block_id: Scalars['String']['input'];
  content: Scalars['JSON']['input'];
};


/** Update your monday.com data. */
export type MutationUpdate_FolderArgs = {
  color?: InputMaybe<FolderColor>;
  custom_icon?: InputMaybe<FolderCustomIcon>;
  folder_id: Scalars['ID']['input'];
  font_weight?: InputMaybe<FolderFontWeight>;
  name?: InputMaybe<Scalars['String']['input']>;
  parent_folder_id?: InputMaybe<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationUpdate_GroupArgs = {
  board_id: Scalars['ID']['input'];
  group_attribute: GroupAttributes;
  group_id: Scalars['String']['input'];
  new_value: Scalars['String']['input'];
};


/** Update your monday.com data. */
export type MutationUpdate_WorkspaceArgs = {
  attributes: UpdateWorkspaceAttributesInput;
  id?: InputMaybe<Scalars['ID']['input']>;
};


/** Update your monday.com data. */
export type MutationUse_TemplateArgs = {
  board_kind?: InputMaybe<BoardKind>;
  board_owner_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  board_owner_team_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  board_subscriber_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  board_subscriber_teams_ids?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  callback_url_on_complete?: InputMaybe<Scalars['String']['input']>;
  destination_folder_id?: InputMaybe<Scalars['Int']['input']>;
  destination_folder_name?: InputMaybe<Scalars['String']['input']>;
  destination_name?: InputMaybe<Scalars['String']['input']>;
  destination_workspace_id?: InputMaybe<Scalars['Int']['input']>;
  skip_target_folder_creation?: InputMaybe<Scalars['Boolean']['input']>;
  template_id: Scalars['Int']['input'];
};

/** A notification. */
export type Notification = {
  __typename?: 'Notification';
  /** The notification's unique identifier. */
  id: Scalars['ID']['output'];
  /** The notification text. */
  text?: Maybe<Scalars['String']['output']>;
};

/** The notification's target type. */
export enum NotificationTargetType {
  /** Update */
  Post = 'Post',
  /** Item or Board. */
  Project = 'Project'
}

/** Indicates where the unit symbol should be placed in a number value */
export enum NumberValueUnitDirection {
  /** The symbol is placed on the left of the number */
  Left = 'left',
  /** The symbol is placed on the right of the number */
  Right = 'right'
}

export type NumbersValue = ColumnValue & {
  __typename?: 'NumbersValue';
  /** The column that this value belongs to. */
  column: Column;
  /** Indicates where the symbol should be placed - on the right or left of the number */
  direction?: Maybe<NumberValueUnitDirection>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Number */
  number?: Maybe<Scalars['Float']['output']>;
  /** The symbol of the unit */
  symbol?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** The working status of a user. */
export type OutOfOffice = {
  __typename?: 'OutOfOffice';
  /** Is the status active? */
  active?: Maybe<Scalars['Boolean']['output']>;
  /** Are notification disabled? */
  disable_notifications?: Maybe<Scalars['Boolean']['output']>;
  /** The status end date. */
  end_date?: Maybe<Scalars['Date']['output']>;
  /** The status start date. */
  start_date?: Maybe<Scalars['Date']['output']>;
  /** Out of office type. */
  type?: Maybe<Scalars['String']['output']>;
};

export type PeopleEntity = {
  __typename?: 'PeopleEntity';
  /** Id of the entity: a person or a team */
  id: Scalars['ID']['output'];
  /** Type of entity */
  kind?: Maybe<Kind>;
};

export type PeopleValue = ColumnValue & {
  __typename?: 'PeopleValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The people and teams assigned to the item. */
  persons_and_teams?: Maybe<Array<PeopleEntity>>;
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type PersonValue = ColumnValue & {
  __typename?: 'PersonValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The person assigned to the item. */
  person_id?: Maybe<Scalars['ID']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type PhoneValue = ColumnValue & {
  __typename?: 'PhoneValue';
  /** The column that this value belongs to. */
  column: Column;
  /** ISO-2 country code */
  country_short_name?: Maybe<Scalars['String']['output']>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Phone number */
  phone?: Maybe<Scalars['String']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** A payment plan. */
export type Plan = {
  __typename?: 'Plan';
  /** The maximum users allowed in the plan. */
  max_users: Scalars['Int']['output'];
  /** The plan's time period. */
  period?: Maybe<Scalars['String']['output']>;
  /** The plan's tier. */
  tier?: Maybe<Scalars['String']['output']>;
  /** The plan's version. */
  version: Scalars['Int']['output'];
};

/** The position relative method. */
export enum PositionRelative {
  /** position after at the given entity. */
  AfterAt = 'after_at',
  /** position before at the given entity. */
  BeforeAt = 'before_at'
}

export type ProgressValue = ColumnValue & {
  __typename?: 'ProgressValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** Get your data from monday.com */
export type Query = {
  __typename?: 'Query';
  /** Get the connected account's information. */
  account?: Maybe<Account>;
  /** Get a collection of installs of an app. */
  app_installs?: Maybe<Array<Maybe<AppInstall>>>;
  /** Get the current app subscription. Note: This query does not work in the playground */
  app_subscription?: Maybe<Array<Maybe<AppSubscription>>>;
  /** Get operations counter current value */
  app_subscription_operations?: Maybe<AppSubscriptionOperationsCounter>;
  /** Get apps monetization information for an account */
  apps_monetization_info?: Maybe<AppsMonetizationInfo>;
  /** Get apps monetization status for an account */
  apps_monetization_status?: Maybe<AppMonetizationStatus>;
  /** Get a collection of assets by ids. */
  assets?: Maybe<Array<Maybe<Asset>>>;
  /** Get a collection of boards. */
  boards?: Maybe<Array<Maybe<Board>>>;
  /** Get the complexity data of your queries. */
  complexity?: Maybe<Complexity>;
  /** Get a collection of docs. */
  docs?: Maybe<Array<Maybe<Document>>>;
  /** Get a collection of folders. Note: This query won't return folders from closed workspaces to which you are not subscribed */
  folders?: Maybe<Array<Maybe<Folder>>>;
  /** Get a collection of items. */
  items?: Maybe<Array<Maybe<Item>>>;
  /** Search items by multiple columns and values. */
  items_page_by_column_values: ItemsResponse;
  /** Get the connected user's information. */
  me?: Maybe<User>;
  /** Get next pages of board's items (rows) by cursor. */
  next_items_page: ItemsResponse;
  /** Get a collection of tags. */
  tags?: Maybe<Array<Maybe<Tag>>>;
  /** Get a collection of teams. */
  teams?: Maybe<Array<Maybe<Team>>>;
  /** Get a collection of updates. */
  updates?: Maybe<Array<Maybe<Update>>>;
  /** Get a collection of users. */
  users?: Maybe<Array<Maybe<User>>>;
  /** Get the API version in use */
  version: Version;
  /** Get a list containing the versions of the API */
  versions: Array<Version>;
  /** Get a collection of webhooks for the board */
  webhooks?: Maybe<Array<Maybe<Webhook>>>;
  /** Get a collection of workspaces. */
  workspaces?: Maybe<Array<Maybe<Workspace>>>;
};


/** Get your data from monday.com */
export type QueryApp_InstallsArgs = {
  account_id?: InputMaybe<Scalars['ID']['input']>;
  app_id: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** Get your data from monday.com */
export type QueryApp_Subscription_OperationsArgs = {
  kind?: InputMaybe<Scalars['String']['input']>;
};


/** Get your data from monday.com */
export type QueryAssetsArgs = {
  ids: Array<Scalars['ID']['input']>;
};


/** Get your data from monday.com */
export type QueryBoardsArgs = {
  board_kind?: InputMaybe<BoardKind>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<BoardsOrderBy>;
  page?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<State>;
  workspace_ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Get your data from monday.com */
export type QueryDocsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  object_ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  order_by?: InputMaybe<DocsOrderBy>;
  page?: InputMaybe<Scalars['Int']['input']>;
  workspace_ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Get your data from monday.com */
export type QueryFoldersArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  workspace_ids?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
};


/** Get your data from monday.com */
export type QueryItemsArgs = {
  exclude_nonactive?: InputMaybe<Scalars['Boolean']['input']>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  newest_first?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** Get your data from monday.com */
export type QueryItems_Page_By_Column_ValuesArgs = {
  board_id: Scalars['ID']['input'];
  columns?: InputMaybe<Array<ItemsPageByColumnValuesQuery>>;
  cursor?: InputMaybe<Scalars['String']['input']>;
  limit?: Scalars['Int']['input'];
};


/** Get your data from monday.com */
export type QueryNext_Items_PageArgs = {
  cursor: Scalars['String']['input'];
  limit?: Scalars['Int']['input'];
};


/** Get your data from monday.com */
export type QueryTagsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};


/** Get your data from monday.com */
export type QueryTeamsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};


/** Get your data from monday.com */
export type QueryUpdatesArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** Get your data from monday.com */
export type QueryUsersArgs = {
  emails?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  kind?: InputMaybe<UserKind>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  newest_first?: InputMaybe<Scalars['Boolean']['input']>;
  non_active?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** Get your data from monday.com */
export type QueryWebhooksArgs = {
  app_webhooks_only?: InputMaybe<Scalars['Boolean']['input']>;
  board_id: Scalars['ID']['input'];
};


/** Get your data from monday.com */
export type QueryWorkspacesArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  kind?: InputMaybe<WorkspaceKind>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  order_by?: InputMaybe<WorkspacesOrderBy>;
  page?: InputMaybe<Scalars['Int']['input']>;
  state?: InputMaybe<State>;
};

export type RatingValue = ColumnValue & {
  __typename?: 'RatingValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Rating value */
  rating?: Maybe<Scalars['Int']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** A reply for an update. */
export type Reply = {
  __typename?: 'Reply';
  /** The reply's html formatted body. */
  body: Scalars['String']['output'];
  /** The reply's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The reply's creator. */
  creator?: Maybe<User>;
  /** The unique identifier of the reply creator. */
  creator_id?: Maybe<Scalars['String']['output']>;
  /** The reply's unique identifier. */
  id: Scalars['ID']['output'];
  /** The reply's text body. */
  text_body?: Maybe<Scalars['String']['output']>;
  /** The reply's last edit date. */
  updated_at?: Maybe<Scalars['Date']['output']>;
};

/** The possible states for a board or item. */
export enum State {
  /** Active only (Default). */
  Active = 'active',
  /** Active, Archived and Deleted. */
  All = 'all',
  /** Archived only. */
  Archived = 'archived',
  /** Deleted only. */
  Deleted = 'deleted'
}

/** A status label style. */
export type StatusLabelStyle = {
  __typename?: 'StatusLabelStyle';
  /** The label's border color in hex format. */
  border: Scalars['String']['output'];
  /** The label's color in hex format. */
  color: Scalars['String']['output'];
};

export type StatusValue = ColumnValue & {
  __typename?: 'StatusValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The index of the status in the board */
  index?: Maybe<Scalars['Int']['output']>;
  /** Whether the status is done */
  is_done?: Maybe<Scalars['Boolean']['output']>;
  /** The label of the status */
  label?: Maybe<Scalars['String']['output']>;
  /** The style of the status label */
  label_style?: Maybe<StatusLabelStyle>;
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The ID of an update attached to the status */
  update_id?: Maybe<Scalars['ID']['output']>;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type SubtasksValue = ColumnValue & {
  __typename?: 'SubtasksValue';
  /** The column that this value belongs to. */
  column: Column;
  /** A string representing all the names of the subtasks, separated by commas */
  display_value: Scalars['String']['output'];
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The subitems */
  subitems: Array<Item>;
  /** The subitems IDs */
  subitems_ids: Array<Scalars['ID']['output']>;
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** A tag */
export type Tag = {
  __typename?: 'Tag';
  /** The tag's color. */
  color: Scalars['String']['output'];
  /** The tag's unique identifier. */
  id: Scalars['ID']['output'];
  /** The tag's name. */
  name: Scalars['String']['output'];
};

export type TagsValue = ColumnValue & {
  __typename?: 'TagsValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Tag ID's */
  tag_ids: Array<Scalars['Int']['output']>;
  /** A list of tags */
  tags: Array<Tag>;
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** A team of users. */
export type Team = {
  __typename?: 'Team';
  /** The team's unique identifier. */
  id: Scalars['ID']['output'];
  /** The team's name. */
  name: Scalars['String']['output'];
  /** The users who are the owners of the team. */
  owners: Array<User>;
  /** The team's picture url. */
  picture_url?: Maybe<Scalars['String']['output']>;
  /** The users in the team. */
  users?: Maybe<Array<Maybe<User>>>;
};


/** A team of users. */
export type TeamOwnersArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};


/** A team of users. */
export type TeamUsersArgs = {
  emails?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
  kind?: InputMaybe<UserKind>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  newest_first?: InputMaybe<Scalars['Boolean']['input']>;
  non_active?: InputMaybe<Scalars['Boolean']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

export type TeamValue = ColumnValue & {
  __typename?: 'TeamValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** ID of the assigned team */
  team_id?: Maybe<Scalars['Int']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** A monday.com template. */
export type Template = {
  __typename?: 'Template';
  /** The template process unique identifier for async operations. */
  process_id?: Maybe<Scalars['String']['output']>;
};

export type TextValue = ColumnValue & {
  __typename?: 'TextValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The column's textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type TimeTrackingHistoryItem = {
  __typename?: 'TimeTrackingHistoryItem';
  /** When the session was added to the cell */
  created_at: Scalars['Date']['output'];
  /** Only applicable if the session has ended */
  ended_at?: Maybe<Scalars['Date']['output']>;
  /** The identifier of an user which ended the tracking */
  ended_user_id?: Maybe<Scalars['ID']['output']>;
  /** A unique session identifier */
  id: Scalars['ID']['output'];
  /** Is true if the session end date was manually entered */
  manually_entered_end_date: Scalars['Boolean']['output'];
  /** Is true if the session end time was manually entered */
  manually_entered_end_time: Scalars['Boolean']['output'];
  /** Is true if the session start date was manually entered */
  manually_entered_start_date: Scalars['Boolean']['output'];
  /** Is true if the session start time was manually entered */
  manually_entered_start_time: Scalars['Boolean']['output'];
  /** Only applicable if the session was added by pressing the play button or via automation */
  started_at?: Maybe<Scalars['Date']['output']>;
  /** The identifier of an user which started the tracking */
  started_user_id?: Maybe<Scalars['ID']['output']>;
  /** The status of the session */
  status: Scalars['String']['output'];
  /** When the session was updated */
  updated_at?: Maybe<Scalars['Date']['output']>;
};

export type TimeTrackingValue = ColumnValue & {
  __typename?: 'TimeTrackingValue';
  /** The column that this value belongs to. */
  column: Column;
  /** Total duration of the time tracker */
  duration?: Maybe<Scalars['Int']['output']>;
  history: Array<TimeTrackingHistoryItem>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Whether the time tracker is running */
  running?: Maybe<Scalars['Boolean']['output']>;
  /** The date when the time tracker was started */
  started_at?: Maybe<Scalars['Date']['output']>;
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  value?: Maybe<Scalars['JSON']['output']>;
};

export type TimelineValue = ColumnValue & {
  __typename?: 'TimelineValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The start date of the timeline */
  from?: Maybe<Scalars['Date']['output']>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The range of dates representing the timeline (YYYY-MM-DD) */
  text?: Maybe<Scalars['String']['output']>;
  /** The end date of the timeline */
  to?: Maybe<Scalars['Date']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
  /** The visualization type for the timeline */
  visualization_type?: Maybe<Scalars['String']['output']>;
};

export type UnsupportedValue = ColumnValue & {
  __typename?: 'UnsupportedValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** Text representation of the column value. Note: Not all columns support textual value */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** An update. */
export type Update = {
  __typename?: 'Update';
  /** The update's assets/files. */
  assets?: Maybe<Array<Maybe<Asset>>>;
  /** The update's html formatted body. */
  body: Scalars['String']['output'];
  /** The update's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The update's creator. */
  creator?: Maybe<User>;
  /** The unique identifier of the update creator. */
  creator_id?: Maybe<Scalars['String']['output']>;
  /** The update's unique identifier. */
  id: Scalars['ID']['output'];
  /** The update's item ID. */
  item_id?: Maybe<Scalars['String']['output']>;
  /** The update's replies. */
  replies?: Maybe<Array<Maybe<Reply>>>;
  /** The update's text body. */
  text_body?: Maybe<Scalars['String']['output']>;
  /** The update's last edit date. */
  updated_at?: Maybe<Scalars['Date']['output']>;
};

/** Attributes of a workspace to update */
export type UpdateWorkspaceAttributesInput = {
  /** The description of the workspace to update */
  description?: InputMaybe<Scalars['String']['input']>;
  /** The kind of the workspace to update (open / closed) */
  kind?: InputMaybe<WorkspaceKind>;
  /** The name of the workspace to update */
  name?: InputMaybe<Scalars['String']['input']>;
};

/** A monday.com user. */
export type User = {
  __typename?: 'User';
  /** The user's account. */
  account: Account;
  /** The user's birthday. */
  birthday?: Maybe<Scalars['Date']['output']>;
  /** The user's country code. */
  country_code?: Maybe<Scalars['String']['output']>;
  /** The user's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The current user's language */
  current_language?: Maybe<Scalars['String']['output']>;
  /** The user's email. */
  email: Scalars['String']['output'];
  /** Is the user enabled or not. */
  enabled: Scalars['Boolean']['output'];
  /** The user's unique identifier. */
  id: Scalars['ID']['output'];
  /** Is the user an account admin. */
  is_admin?: Maybe<Scalars['Boolean']['output']>;
  /** Is the user a guest or not. */
  is_guest?: Maybe<Scalars['Boolean']['output']>;
  /** Is the user a pending user */
  is_pending?: Maybe<Scalars['Boolean']['output']>;
  /** Is user verified his email. */
  is_verified?: Maybe<Scalars['Boolean']['output']>;
  /** Is the user a view only user or not. */
  is_view_only?: Maybe<Scalars['Boolean']['output']>;
  /** The date the user joined the account. */
  join_date?: Maybe<Scalars['Date']['output']>;
  /** Last date & time when user was active */
  last_activity?: Maybe<Scalars['Date']['output']>;
  /** The user's location. */
  location?: Maybe<Scalars['String']['output']>;
  /** The user's mobile phone number. */
  mobile_phone?: Maybe<Scalars['String']['output']>;
  /** The user's name. */
  name: Scalars['String']['output'];
  /** The user's out of office status. */
  out_of_office?: Maybe<OutOfOffice>;
  /** The user's phone number. */
  phone?: Maybe<Scalars['String']['output']>;
  /** The user's photo in the original size. */
  photo_original?: Maybe<Scalars['String']['output']>;
  /** The user's photo in small size (150x150). */
  photo_small?: Maybe<Scalars['String']['output']>;
  /** The user's photo in thumbnail size (100x100). */
  photo_thumb?: Maybe<Scalars['String']['output']>;
  /** The user's photo in small thumbnail size (50x50). */
  photo_thumb_small?: Maybe<Scalars['String']['output']>;
  /** The user's photo in tiny size (30x30). */
  photo_tiny?: Maybe<Scalars['String']['output']>;
  /** The product to which the user signed up to first. */
  sign_up_product_kind?: Maybe<Scalars['String']['output']>;
  /** The teams the user is a member in. */
  teams?: Maybe<Array<Maybe<Team>>>;
  /** The user's timezone identifier. */
  time_zone_identifier?: Maybe<Scalars['String']['output']>;
  /** The user's title. */
  title?: Maybe<Scalars['String']['output']>;
  /** The user's profile url. */
  url: Scalars['String']['output'];
  /** The user’s utc hours difference. */
  utc_hours_diff?: Maybe<Scalars['Int']['output']>;
};


/** A monday.com user. */
export type UserTeamsArgs = {
  ids?: InputMaybe<Array<Scalars['ID']['input']>>;
};

/** The possibilities for a user kind. */
export enum UserKind {
  /** All users in account. */
  All = 'all',
  /** Only guests. */
  Guests = 'guests',
  /** Only company members. */
  NonGuests = 'non_guests',
  /** All non pending members. */
  NonPending = 'non_pending'
}

/** An object containing the API version details */
export type Version = {
  __typename?: 'Version';
  /** The display name of the API version */
  display_name: Scalars['String']['output'];
  /** The type of the API version */
  kind: VersionKind;
  /** Version string that can be used in API-Version header */
  value: Scalars['String']['output'];
};

/** All possible API version types */
export enum VersionKind {
  /** Current version */
  Current = 'current',
  /** No longer supported version. Migrate to current version as soon as possible */
  Deprecated = 'deprecated',
  /** Bleeding-edge rolling version that constantly changes */
  Dev = 'dev',
  /** Previous version. Migrate to current version as soon as possible */
  Maintenance = 'maintenance',
  /** Old version that will be deprecated in January. Migrate to current version as soon as possible */
  OldMaintenance = 'old__maintenance',
  /** Old version that will be deprecated in January. Migrate to current version as soon as possible */
  OldPreviousMaintenance = 'old_previous_maintenance',
  /** Older version that will be deprecated in January. Migrate to current version as soon as possible */
  PreviousMaintenance = 'previous_maintenance',
  /** Next version */
  ReleaseCandidate = 'release_candidate'
}

export type VoteValue = ColumnValue & {
  __typename?: 'VoteValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
  /** The total number of votes */
  vote_count: Scalars['Int']['output'];
  /** A list of IDs of users who voted */
  voter_ids: Array<Scalars['ID']['output']>;
  /** A list of users who voted */
  voters: Array<User>;
};

/** Monday webhooks */
export type Webhook = {
  __typename?: 'Webhook';
  /** The webhooks's board id. */
  board_id: Scalars['ID']['output'];
  /** The webhooks's config. */
  config?: Maybe<Scalars['String']['output']>;
  /** The event webhook will listen to */
  event: WebhookEventType;
  /** The webhooks's unique identifier. */
  id: Scalars['ID']['output'];
};

/** The webhook's target type. */
export enum WebhookEventType {
  /** Column value changed on board */
  ChangeColumnValue = 'change_column_value',
  /** An item name changed on board */
  ChangeName = 'change_name',
  /** Specific Column value changed on board */
  ChangeSpecificColumnValue = 'change_specific_column_value',
  /** Status column value changed on board */
  ChangeStatusColumnValue = 'change_status_column_value',
  /** Column value changed on board subitem */
  ChangeSubitemColumnValue = 'change_subitem_column_value',
  /** An subitem name changed on board */
  ChangeSubitemName = 'change_subitem_name',
  /** Column created on a board */
  CreateColumn = 'create_column',
  /** An item was created on board */
  CreateItem = 'create_item',
  /** A subitem was created on a board */
  CreateSubitem = 'create_subitem',
  /** An update was posted on board subitem */
  CreateSubitemUpdate = 'create_subitem_update',
  /** An update was posted on board item */
  CreateUpdate = 'create_update',
  /** An update was deleted from board item */
  DeleteUpdate = 'delete_update',
  /** An update was edited on board item */
  EditUpdate = 'edit_update',
  /** An item was archived on a board */
  ItemArchived = 'item_archived',
  /** An item was deleted from a board */
  ItemDeleted = 'item_deleted',
  /** An item is moved to any group */
  ItemMovedToAnyGroup = 'item_moved_to_any_group',
  /** An item is moved to a specific group */
  ItemMovedToSpecificGroup = 'item_moved_to_specific_group',
  /** An item restored back to board */
  ItemRestored = 'item_restored',
  /** A subitem is moved from one parent to another */
  MoveSubitem = 'move_subitem',
  /** A subitem was archived on a board */
  SubitemArchived = 'subitem_archived',
  /** A subitem was deleted from a board */
  SubitemDeleted = 'subitem_deleted'
}

export type WeekValue = ColumnValue & {
  __typename?: 'WeekValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The end date of the week */
  end_date?: Maybe<Scalars['Date']['output']>;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  /** The start date of the week */
  start_date?: Maybe<Scalars['Date']['output']>;
  /** The range of dates representing the week (YYYY-MM-DD) */
  text?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

/** A monday.com workspace. */
export type Workspace = {
  __typename?: 'Workspace';
  /** The account product that contains workspace. */
  account_product?: Maybe<AccountProduct>;
  /** The workspace's creation date. */
  created_at?: Maybe<Scalars['Date']['output']>;
  /** The workspace's description. */
  description?: Maybe<Scalars['String']['output']>;
  /** The workspace's unique identifier. */
  id?: Maybe<Scalars['ID']['output']>;
  /** Returns true if it is the default workspace of the product or account */
  is_default_workspace?: Maybe<Scalars['Boolean']['output']>;
  /** The workspace's kind (open / closed). */
  kind?: Maybe<WorkspaceKind>;
  /** The workspace's name. */
  name: Scalars['String']['output'];
  /** The workspace's user owners. */
  owners_subscribers?: Maybe<Array<Maybe<User>>>;
  /** The workspace's settings. */
  settings?: Maybe<WorkspaceSettings>;
  /** The workspace's state (all / active / archived / deleted). */
  state?: Maybe<State>;
  /** The workspace's team owners. */
  team_owners_subscribers?: Maybe<Array<Team>>;
  /** The teams subscribed to the workspace. */
  teams_subscribers?: Maybe<Array<Maybe<Team>>>;
  /** The users subscribed to the workspace */
  users_subscribers?: Maybe<Array<Maybe<User>>>;
};


/** A monday.com workspace. */
export type WorkspaceOwners_SubscribersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** A monday.com workspace. */
export type WorkspaceTeam_Owners_SubscribersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** A monday.com workspace. */
export type WorkspaceTeams_SubscribersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** A monday.com workspace. */
export type WorkspaceUsers_SubscribersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};

/** The workspace's icon. */
export type WorkspaceIcon = {
  __typename?: 'WorkspaceIcon';
  /** The icon color in hex value. Used as a background for the image. */
  color?: Maybe<Scalars['String']['output']>;
  /**
   * The public image URL, which is temporary in the case of a file that was
   * uploaded by the user, so you'll need to pull a new version at least once an hour.
   *                                In case it is null, you can use the first letter of the workspace name.
   */
  image?: Maybe<Scalars['String']['output']>;
};

/** The workspace kinds available. */
export enum WorkspaceKind {
  /** Closed workspace, available to enterprise only. */
  Closed = 'closed',
  /** Open workspace. */
  Open = 'open'
}

/** The workspace's settings. */
export type WorkspaceSettings = {
  __typename?: 'WorkspaceSettings';
  /** The workspace icon. */
  icon?: Maybe<WorkspaceIcon>;
};

/** The workspace subscriber kind. */
export enum WorkspaceSubscriberKind {
  /** Workspace owner. */
  Owner = 'owner',
  /** Workspace subscriber. */
  Subscriber = 'subscriber'
}

/** Options to order by. */
export enum WorkspacesOrderBy {
  /** The rank order of the workspace creation time (desc). */
  CreatedAt = 'created_at'
}

export type WorldClockValue = ColumnValue & {
  __typename?: 'WorldClockValue';
  /** The column that this value belongs to. */
  column: Column;
  /** The column's unique identifier. */
  id: Scalars['ID']['output'];
  text?: Maybe<Scalars['String']['output']>;
  /** Timezone */
  timezone?: Maybe<Scalars['String']['output']>;
  /** The column's type. */
  type: ColumnType;
  /** The date when column value was last updated. */
  updated_at?: Maybe<Scalars['Date']['output']>;
  /** The column's raw value in JSON format. */
  value?: Maybe<Scalars['JSON']['output']>;
};

export type GetBoardsQueryVariables = Exact<{
  ids?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
}>;


export type GetBoardsQuery = { __typename?: 'Query', boards?: Array<{ __typename?: 'Board', id: string, name: string } | null> | null };

export type CreateItemMutationVariables = Exact<{
  boardId: Scalars['ID']['input'];
  groupId: Scalars['String']['input'];
  itemName: Scalars['String']['input'];
}>;


export type CreateItemMutation = { __typename?: 'Mutation', create_item?: { __typename?: 'Item', id: string, name: string } | null };

export type GetColumnValueQueryVariables = Exact<{
  itemId?: InputMaybe<Array<Scalars['ID']['input']> | Scalars['ID']['input']>;
  columnId?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
}>;


export type GetColumnValueQuery = { __typename?: 'Query', items?: Array<{ __typename?: 'Item', column_values: Array<{ __typename?: 'BoardRelationValue', value?: any | null } | { __typename?: 'ButtonValue', value?: any | null } | { __typename?: 'CheckboxValue', value?: any | null } | { __typename?: 'ColorPickerValue', value?: any | null } | { __typename?: 'CountryValue', value?: any | null } | { __typename?: 'CreationLogValue', value?: any | null } | { __typename?: 'DateValue', value?: any | null } | { __typename?: 'DependencyValue', value?: any | null } | { __typename?: 'DocValue', value?: any | null } | { __typename?: 'DropdownValue', value?: any | null } | { __typename?: 'EmailValue', value?: any | null } | { __typename?: 'FileValue', value?: any | null } | { __typename?: 'FormulaValue', value?: any | null } | { __typename?: 'GroupValue', value?: any | null } | { __typename?: 'HourValue', value?: any | null } | { __typename?: 'IntegrationValue', value?: any | null } | { __typename?: 'ItemIdValue', value?: any | null } | { __typename?: 'LastUpdatedValue', value?: any | null } | { __typename?: 'LinkValue', value?: any | null } | { __typename?: 'LocationValue', value?: any | null } | { __typename?: 'LongTextValue', value?: any | null } | { __typename?: 'MirrorValue', value?: any | null } | { __typename?: 'NumbersValue', value?: any | null } | { __typename?: 'PeopleValue', value?: any | null } | { __typename?: 'PersonValue', value?: any | null } | { __typename?: 'PhoneValue', value?: any | null } | { __typename?: 'ProgressValue', value?: any | null } | { __typename?: 'RatingValue', value?: any | null } | { __typename?: 'StatusValue', value?: any | null } | { __typename?: 'SubtasksValue', value?: any | null } | { __typename?: 'TagsValue', value?: any | null } | { __typename?: 'TeamValue', value?: any | null } | { __typename?: 'TextValue', value?: any | null } | { __typename?: 'TimeTrackingValue', value?: any | null } | { __typename?: 'TimelineValue', value?: any | null } | { __typename?: 'UnsupportedValue', value?: any | null } | { __typename?: 'VoteValue', value?: any | null } | { __typename?: 'WeekValue', value?: any | null } | { __typename?: 'WorldClockValue', value?: any | null }> } | null> | null };
