const ISSUE_FIELD_DEFS = [
  {
    id: 'url',
    outboundType: 'text',
    title: 'URL',
  },
  {
    id: 'repository_url',
    outboundType: 'text',
    title: 'Repository URL',
  },
  {
    id: 'labels_url',
    outboundType: 'text',
    title: 'Labels URL',
  },
  {
    id: 'labels',
    outboundType: 'text_array',
    title: 'Labels',
  },
  {
    id: 'comments_url',
    outboundType: 'text',
    title: 'Comments URL',
  },
  {
    id: 'events_url',
    outboundType: 'text',
    title: 'Events URL',
  },
  {
    id: 'html_url',
    outboundType: 'text',
    title: 'Html URL',
  },
  {
    id: 'number',
    outboundType: 'numeric',
    title: 'Number',
  },
  {
    id: 'title',
    outboundType: 'text',
    inboundTypes: ['text'],
    title: 'Title',
  },
  {
    id: 'state',
    outboundType: 'text',
    title: 'State',
  },
  {
    id: 'locked',
    outboundType: 'text',
    title: 'Locked',
  },
  {
    id: 'assignee',
    outboundType: 'text',
    title: 'Assignee',
  },
  {
    id: 'assignees',
    outboundType: 'text',
    title: 'Assignees',
  },
  {
    id: 'milestone',
    outboundType: 'text',
    title: 'Milestone',
  },
  {
    id: 'comments',
    outboundType: 'numeric',
    title: 'Comments Number',
  },
  {
    id: 'body',
    outboundType: 'text',
    inboundTypes: ['text'],
    title: 'Body',
  },
  {
    id: 'id',
    outboundType: 'numeric',
    title: 'ID',
  },
];

module.exports = { ISSUE_FIELD_DEFS };
