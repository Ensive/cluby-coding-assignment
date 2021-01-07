// TODO: replace with ref
export function focusFormInput() {
  try {
    const formsCount = document.querySelectorAll('form').length;
    if (formsCount > 0) {
      document
        .querySelectorAll('form')
        [formsCount - 1].querySelectorAll('input')[0]
        .focus();
    }
  } catch (e) {
    console.error(e);
  }
}
