import { writable } from "svelte/store";

const webservers = writable([]);

const customWebserversStore = {
  subscribe: webservers.subscribe,
  setWebservers: (webserverArray) => {
    webservers.set(webserverArray);
  },
  addWebserver: (webserverData) => {
    const newwebserver = {
      ...webserverData,
    };
    webservers.update((items) => {
      return [newWebserver, ...items];
    });
  },
  updateWebserver: (id, webserverData) => {
    webservers.update((items) => {
      const webserverIndex = items.findIndex((i) => i.id === id);
      const updatedWebserver = {
        ...items[webserverIndex],
        ...webserverData,
      };
      const updatedWebservers = [...items];
      updatedWebservers[webserverIndex] = updatedWebserver;
      return updatedWebservers;
    });
  },
  removeWebserver: (id) => {
    webservers.update((items) => {
      return items.filter((i) => i.id !== id);
    });
  },
  updateStatus: (id, status) => {
    webservers.update((items) => {
      const updatedWebserver = { ...items.find((m) => m.webserver === id) };
      updatedwebserver.status_svc = status;      
      const webserverIndex = items.findIndex((m) => m.webserver === id);
      const updatedWebservers = [...items];
      updatedWebservers[webserverIndex] = updatedWebserver;
      return updatedWebservers;
    });
  },
};

export default customWebserversStore;