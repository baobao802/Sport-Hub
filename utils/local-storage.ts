const getItem = (name: string) => {
  if (typeof localStorage === 'undefined') return;

  const itemStr = localStorage.getItem(name);
  return itemStr ? JSON.parse(itemStr) : null;
};

const setItem = (name: string, value: any) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem(name, JSON.stringify(value));
};

const removeItem = (name: string) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.removeItem(name);
};

const localStore = { getItem, setItem, removeItem };

export default localStore;
