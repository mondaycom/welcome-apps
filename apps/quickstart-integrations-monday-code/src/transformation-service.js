export const transformText = (value, type) => {
  let region = process.env.MNDY_REGION ? process.env.MNDY_REGION.toUpperCase() : null;
  if (!region || region === '') {
    region = 'MNDY_REGION env not found';
  }

  switch (type) {
    case 'TO_UPPER_CASE':
      return value.toUpperCase();
    case 'TO_LOWER_CASE':
      return value.toLowerCase();
    case 'TO_CURRENT_REGION':
      return `"${region}"`;
    default:
      return value.toUpperCase();
  }
};
