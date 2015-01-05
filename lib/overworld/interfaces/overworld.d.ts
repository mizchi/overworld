import Portal = require('../portal');
import Context = require('../world');
interface Overworld {
    Portal: typeof Portal;
    Context: typeof Context;
    mixinFor: any;
    setReact: any;
}
export = Overworld;
