import { writable } from "svelte/store";

const webservices = writable([]);

const customWebservicesStore = {
  subscribe: webservices.subscribe,
  setWebservices: (webserviceArray) => {
    webservices.set(webserviceArray);
  },
  addWebservice: (webserviceData) => {
    const newWebservice = {
      ...webserviceData,
    };
    webservices.update((items) => {
      return [newWebservice, ...items];
    });
  },
  updateWebservice: (id, webserviceData) => {
    webservices.update((items) => {
      const webserviceIndex = items.findIndex((i) => i.id === id);
      const updatedWebservice = {
        ...items[webserviceIndex],
        ...webserviceData,
      };
      const updatedWebservices = [...items];
      updatedWebservices[webserviceIndex] = updatedWebservice;
      return updatedWebservices;
    });
  },
  removeWebservice: (id) => {
    webservices.update((items) => {
      return items.filter((i) => i.id !== id);
    });
  },
  updateStatus: (id, status) => {
    webservices.update((items) => {
      const updatedWebservice = { ...items.find((m) => m.webservice === id) };
      updatedWebservice.status_svc = status;      
      const webserviceIndex = items.findIndex((m) => m.webservice === id);
      const updatedWebservices = [...items];
      updatedWebservices[webserviceIndex] = updatedWebservice;
      return updatedWebservices;
    });
  },
};

export default customWebservicesStore;