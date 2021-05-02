import { Base } from '../classes/Base';

export const ProxySetToUpdate: ProxyHandler<Base<Record<string, unknown>>> = {
  set(target, prop, val) {
    target
      .update({
        [prop]: val,
      })
      .catch(err => {
        throw err;
      });
    return true;
  },
};
