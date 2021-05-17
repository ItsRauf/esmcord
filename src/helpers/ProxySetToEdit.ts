import { Base } from '../classes/Base';

const disallowedProps = ['$'];

export const ProxySetToEdit: ProxyHandler<Base<Record<string, unknown>>> = {
  // Map setting (<Base>.prop = val) to calling <Base>.edit
  set(target, prop, val) {
    prop = String(prop);
    if (prop in disallowedProps) return false;
    const props = Object.getOwnPropertyNames(target);
    if (props.includes(prop)) {
      const originalVal = target[prop];
      target[prop] = val;
      target
        .edit({
          [prop]: val,
        })
        .catch(err => {
          prop = String(prop);
          target[prop] = originalVal;
          throw err;
        });
      return true;
    }
    return false;
  },
};
