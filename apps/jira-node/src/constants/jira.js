const ISSUE_FIELD_DEFS = [
    {
      id: 'id',
      outboundType: 'numeric',
      title: 'Issue ID',
    },
    {
      id: 'key',
      outboundType: 'text',
      title: 'Issue Key',
    },
    {
      id: 'description',
      outboundType: 'text',
      title: 'Issue Description',
    },
    {
      id: 'priority',
      outboundType: 'text',
      title: 'Priority Field',
    },
    {
      id: 'status',
      outboundType: 'text',
      title: 'Status Name',
    },
    {
      id: 'creator',
      outboundType: 'text',
      title: 'Creator Name',
    }
  ];
  
  module.exports = { ISSUE_FIELD_DEFS };
  