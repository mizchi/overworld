import World = require('./world');
import utils = require('./utils/utils');
import Aggregator = require('./aggregator');
import LifeCycle = require('./lifecycle');

interface LinkNode {
  type: string;
  uuid: string;
  instance: World;
  target: any;
}

interface Cache {
  component: any;
  target: any;
  uuid: string;
}

class Portal {
  _linkMap: any; // string => typeof World
  _caches: any; // string => React.Component

  public el: HTMLElement;
  private _nodes: LinkNode[];
  private _cursor: number;
  private _activeNode: LinkNode;

  constructor(){
    this._linkMap = {}; //TODO: valid struct
    this._caches = {};
    this._nodes = [];
    this._activeNode = null;
    this._cursor = 0;
  }

  // for mixin
  getActiveEmitter(){
    return this._activeNode.instance.emitter;
  }

  public link(name, world){
    if(this._linkMap[name]) throw name+' is already registered';
    this._linkMap[name] = world;
  }

  private buildLinkNode(name, forceCreate: boolean = false)
  : Promise<{node: LinkNode; cache?: Cache;}>{
    var React = utils.getReact();
    var lastNode: LinkNode = this._activeNode;
    if(lastNode){
      //TODO: remove all
      lastNode.target.style.display = 'none';
      lastNode.instance.pause();
    }

    // setup caches
    var cache: Cache = null;
    var component;
    var target;
    var uuid;
    if(this._caches[name] && !forceCreate) {
      cache = this._caches[name];
      component = this._caches[name].component;
      target = this._caches[name].target;
      uuid = this._caches[name].uuid;
    } else {
      component = null;
      target = utils.createContainer();
      uuid = utils.uuid();
      target.className = name+'-'+uuid;
      this.el.appendChild(target);
    }

    if(!this._linkMap[name]){
      throw name+' is not linked to any world';
    }

    var node: LinkNode = {
      type: name,
      uuid: utils.uuid(),
      instance: new this._linkMap[name](),
      target: target
    };

    //fooo
    node.instance.emitter.emit(LifeCycle.CREATED);

    return new Promise((done) =>{
      /*this.renderNode(node, props, component).then(()=> done({node:node, cache: cache}))*/
      done({node:node, cache: cache});
    });
  }

  private renderNode(node: LinkNode, props, component): Promise<any>{
    var world = node.instance;
    return new Promise((done) =>{
      world.aggregator.buildTemplateProps(props).then((result) => {
        // backdoor initializer
        world.init(result.props, result.state);
        world.renderTo(result.templateProps, node.target, component).then((mountedComponent)=>{
          this._caches[node.type] = {
            component: mountedComponent,
            target: node.target,
            uuid: node.uuid
          };
          node.target.style.display = 'block';
          done();
        });
      });
    });
  }

  // skip init
  private resumeNode(node: LinkNode): Promise<any>{
    var world = node.instance;
    return new Promise(done => {
      Promise.resolve(world.aggregator.buildTemplateProps(world.props, world.state))
      .then(templateProps => {
        var component = this._caches[node.type].component;
        world.renderTo(templateProps, node.target, component).then((mountedComponent) =>{
          node.target.style.display = 'block';
          done();
        });
      });
    });
  }

  public mount(el){
    this.el = el
  }

  // swap root
  public transition(name, props): Promise<any>{
    //TODO: dispose correctly
    this._nodes.length = 0;
    return new Promise((done)=>{
      this.buildLinkNode(name).then((nodeWithCache) =>{
        var node = nodeWithCache.node;
        var component = nodeWithCache.cache ? nodeWithCache.cache.component : null;

        this._cursor = 0;
        this._activeNode = node;
        this._nodes.push(node);
        this.renderNode(node, props, component).then(done);
      });
    });
  }

  public pushWorld(name, props){
    return new Promise((done)=>{
      this.buildLinkNode(name).then((nodeWithCache) =>{
        var node = nodeWithCache.node;
        var component = nodeWithCache.cache ? nodeWithCache.cache.component : null;
        //TODO: fix
        this._cursor++;

        var focusNode = this._nodes[this._cursor];

        if(!focusNode){
          // create new node
          this._nodes.push(node);
        } else if(focusNode.type === name) {
          // reuse if next instance is same type
          node = focusNode;
        } else {
          // remove after this and push new node
          this._nodes.length = this._cursor;
          this._nodes.push(node);
        }
        this._activeNode = node;

        this.renderNode(node, props, component).then(done);
      });
    });
  }

  public popWorld(resumeParams: any = {}){
    // TODO: cache next node and reuse instance
    var lastNode = this._activeNode;
    if(lastNode){
      //TODO: remove all
      lastNode.target.style.display = 'none';
      lastNode.instance.pause();
    }

    this._cursor--;
    var node = this._nodes[this._cursor];
    this._activeNode = node;
    return new Promise((done) => {
      if(node) {
        this.resumeNode(node).then(()=>{
          node.instance.resume();
          done();
        });
      } else {
        done();
      }
    });
  }

  public serialize(){
    return this._nodes.map(node => ({
      props: node.instance.props,
      state: node.instance.state,
      type: node.type
    }));
  }
}

export = Portal;
