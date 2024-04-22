const nameValidation = (name) => {
  const nameRegex = /^([a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*){1,50}$/;
  return nameRegex.test(name);
};

export default {
    nameValidation,
}