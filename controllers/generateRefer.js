module.exports = function generateReferralCode(name) {
  const prefix = name.trim().slice(0, 3).toUpperCase();
  const suffix = Math.random().toString(36).substr(2, 5).toUpperCase();
  return prefix + suffix;
};
