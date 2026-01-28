export const getInitials = (firstName, lastName) => {
    if (!firstName || !lastName) return "U";
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  };
  