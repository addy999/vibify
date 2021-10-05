
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = append_empty_stylesheet(node).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    function hasContext(key) {
        return get_current_component().$$.context.has(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.5' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    function p(e,a=!1){return e=e.slice(e.startsWith("/#")?2:0,e.endsWith("/*")?-2:void 0),e.startsWith("/")||(e="/"+e),e==="/"&&(e=""),a&&!e.endsWith("/")&&(e+="/"),e}function d(e,a){e=p(e,!0),a=p(a,!0);let r=[],n={},t=!0,s=e.split("/").map(c=>c.startsWith(":")?(r.push(c.slice(1)),"([^\\/]+)"):c).join("\\/"),o=a.match(new RegExp(`^${s}$`));return o||(t=!1,o=a.match(new RegExp(`^${s}`))),o?(r.forEach((c,h)=>n[c]=o[h+1]),{exact:t,params:n,part:o[0].slice(0,-1)}):null}function x(e,a,r){if(r==="")return e;if(r[0]==="/")return r;let n=o=>o.split("/").filter(c=>c!==""),t=n(e),s=a?n(a):[];return "/"+s.map((o,c)=>t[c]).join("/")+"/"+r}function m(e,a,r,n){let t=[a,"data-"+a].reduce((s,o)=>{let c=e.getAttribute(o);return r&&e.removeAttribute(o),c===null?s:c},!1);return !n&&t===""?!0:t||n||!1}function S(e){let a=e.split("&").map(r=>r.split("=")).reduce((r,n)=>{let t=n[0];if(!t)return r;let s=n.length>1?n[n.length-1]:!0;return typeof s=="string"&&s.includes(",")&&(s=s.split(",")),r[t]===void 0?r[t]=[s]:r[t].push(s),r},{});return Object.entries(a).reduce((r,n)=>(r[n[0]]=n[1].length>1?n[1]:n[1][0],r),{})}function v(e){return Object.entries(e).map(([a,r])=>r?r===!0?a:`${a}=${Array.isArray(r)?r.join(","):r}`:null).filter(a=>a).join("&")}function w(e,a){return e?a+e:""}function k(e){throw new Error("[Tinro] "+e)}var i={HISTORY:1,HASH:2,MEMORY:3,OFF:4,run(e,a,r,n){return e===this.HISTORY?a&&a():e===this.HASH?r&&r():n&&n()},getDefault(){return !window||window.location.pathname==="srcdoc"?this.MEMORY:this.HISTORY}};var R,M,$,b="",l=L();function L(){let e=i.getDefault(),a,r=o=>window.onhashchange=window.onpopstate=R=null,n=o=>a&&a(y(e)),t=o=>{o&&(e=o),r(),e!==i.OFF&&i.run(e,c=>window.onpopstate=n,c=>window.onhashchange=n)&&n();},s=o=>{let c=Object.assign(y(e),o);return c.path+w(v(c.query),"?")+w(c.hash,"#")};return {mode:t,get:o=>y(e),go(o,c){_$1(e,o,c),n();},start(o){a=o,t();},stop(){a=null,t(i.OFF);},set(o){this.go(s(o),!o.path);},methods(){return A(this)},base:o=>b=o}}function _$1(e,a,r){!r&&(M=$);let n=t=>history[`${r?"replace":"push"}State`]({},"",t);i.run(e,t=>n(b+a),t=>n(`#${a}`),t=>R=a);}function y(e){let a=window.location,r=i.run(e,t=>(b?a.pathname.replace(b,""):a.pathname)+a.search+a.hash,t=>String(a.hash.slice(1)||"/"),t=>R||"/"),n=r.match(/^([^?#]+)(?:\?([^#]+))?(?:\#(.+))?$/);return $=r,{url:r,from:M,path:n[1]||"",query:S(n[2]||""),hash:n[3]||""}}function A(e){let a=()=>e.get().query,r=o=>e.set({query:o}),n=o=>r(o(a())),t=()=>e.get().hash,s=o=>e.set({hash:o});return {hash:{get:t,set:s,clear:()=>s("")},query:{replace:r,clear:()=>r(""),get(o){return o?a()[o]:a()},set(o,c){n(h=>(h[o]=c,h));},delete(o){n(c=>(c[o]&&delete c[o],c));}}}}var f=T();function T(){let{subscribe:e}=writable(l.get(),a=>{l.start(a);let r=P(l.go);return ()=>{l.stop(),r();}});return {subscribe:e,goto:l.go,params:Q,meta:O,useHashNavigation:a=>l.mode(a?i.HASH:i.HISTORY),mode:{hash:()=>l.mode(i.HASH),history:()=>l.mode(i.HISTORY),memory:()=>l.mode(i.MEMORY)},base:l.base,location:l.methods()}}function P(e){let a=r=>{let n=r.target.closest("a[href]"),t=n&&m(n,"target",!1,"_self"),s=n&&m(n,"tinro-ignore"),o=r.ctrlKey||r.metaKey||r.altKey||r.shiftKey;if(t=="_self"&&!s&&!o&&n){let c=n.getAttribute("href").replace(/^\/#/,"");/^\/\/|^[a-zA-Z]+:/.test(c)||(r.preventDefault(),e(c.startsWith("/")?c:n.href.replace(window.location.origin,"")));}};return addEventListener("click",a),()=>removeEventListener("click",a)}function Q(){return getContext("tinro").meta.params}var g="tinro",K=j({pattern:"",matched:!0});function q(e){let a=getContext(g)||K;(a.exact||a.fallback)&&k(`${e.fallback?"<Route fallback>":`<Route path="${e.path}">`}  can't be inside ${a.fallback?"<Route fallback>":`<Route path="${a.path||"/"}"> with exact path`}`);let r=e.fallback?"fallbacks":"childs",n=writable({}),t=j({fallback:e.fallback,parent:a,update(s){t.exact=!s.path.endsWith("/*"),t.pattern=p(`${t.parent.pattern||""}${s.path}`),t.redirect=s.redirect,t.firstmatch=s.firstmatch,t.breadcrumb=s.breadcrumb,t.match();},register:()=>(t.parent[r].add(t),async()=>{t.parent[r].delete(t),t.parent.activeChilds.delete(t),t.router.un&&t.router.un(),t.parent.match();}),show:()=>{e.onShow(),!t.fallback&&t.parent.activeChilds.add(t);},hide:()=>{e.onHide(),t.parent.activeChilds.delete(t);},match:async()=>{t.matched=!1;let{path:s,url:o,from:c,query:h}=t.router.location,u=d(t.pattern,s);if(!t.fallback&&u&&t.redirect&&(!t.exact||t.exact&&u.exact)){let E=x(s,t.parent.pattern,t.redirect);return f.goto(E,!0)}t.meta=u&&{from:c,url:o,query:h,match:u.part,pattern:t.pattern,breadcrumbs:t.parent.meta&&t.parent.meta.breadcrumbs.slice()||[],params:u.params,subscribe:n.subscribe},t.breadcrumb&&t.meta&&t.meta.breadcrumbs.push({name:t.breadcrumb,path:u.part}),n.set(t.meta),u&&!t.fallback&&(!t.exact||t.exact&&u.exact)&&(!t.parent.firstmatch||!t.parent.matched)?(e.onMeta(t.meta),t.parent.matched=!0,t.show()):t.hide(),u&&t.showFallbacks();}});return setContext(g,t),onMount(()=>t.register()),t}function O(){return hasContext(g)?getContext(g).meta:k("meta() function must be run inside any `<Route>` child component only")}function j(e){let a={router:{},exact:!1,pattern:null,meta:null,parent:null,fallback:!1,redirect:!1,firstmatch:!1,breadcrumb:null,matched:!1,childs:new Set,activeChilds:new Set,fallbacks:new Set,async showFallbacks(){if(!this.fallback&&(await tick(),this.childs.size>0&&this.activeChilds.size==0||this.childs.size==0&&this.fallbacks.size>0)){let r=this;for(;r.fallbacks.size==0;)if(r=r.parent,!r)return;r&&r.fallbacks.forEach(n=>{if(n.redirect){let t=x("/",n.parent.pattern,n.redirect);f.goto(t,!0);}else n.show();});}},start(){this.router.un||(this.router.un=f.subscribe(r=>{this.router.location=r,this.pattern!==null&&this.match();}));},match(){this.showFallbacks();}};return Object.assign(a,e),a.start(),a}

    /* node_modules/tinro/cmp/Route.svelte generated by Svelte v3.42.5 */

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*params*/ 2,
    	meta: dirty & /*meta*/ 4
    });

    const get_default_slot_context = ctx => ({
    	params: /*params*/ ctx[1],
    	meta: /*meta*/ ctx[2]
    });

    // (33:0) {#if showContent}
    function create_if_block$b(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, params, meta*/ 262)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$b.name,
    		type: "if",
    		source: "(33:0) {#if showContent}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*showContent*/ ctx[0] && create_if_block$b(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*showContent*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*showContent*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$b(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Route', slots, ['default']);
    	let { path = '/*' } = $$props;
    	let { fallback = false } = $$props;
    	let { redirect = false } = $$props;
    	let { firstmatch = false } = $$props;
    	let { breadcrumb = null } = $$props;
    	let showContent = false;
    	let params = {}; /* DEPRECATED */
    	let meta = {};

    	const route = q({
    		fallback,
    		onShow() {
    			$$invalidate(0, showContent = true);
    		},
    		onHide() {
    			$$invalidate(0, showContent = false);
    		},
    		onMeta(newmeta) {
    			$$invalidate(2, meta = newmeta);
    			$$invalidate(1, params = meta.params); /* DEPRECATED */
    		}
    	});

    	const writable_props = ['path', 'fallback', 'redirect', 'firstmatch', 'breadcrumb'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Route> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    		if ('fallback' in $$props) $$invalidate(4, fallback = $$props.fallback);
    		if ('redirect' in $$props) $$invalidate(5, redirect = $$props.redirect);
    		if ('firstmatch' in $$props) $$invalidate(6, firstmatch = $$props.firstmatch);
    		if ('breadcrumb' in $$props) $$invalidate(7, breadcrumb = $$props.breadcrumb);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createRouteObject: q,
    		path,
    		fallback,
    		redirect,
    		firstmatch,
    		breadcrumb,
    		showContent,
    		params,
    		meta,
    		route
    	});

    	$$self.$inject_state = $$props => {
    		if ('path' in $$props) $$invalidate(3, path = $$props.path);
    		if ('fallback' in $$props) $$invalidate(4, fallback = $$props.fallback);
    		if ('redirect' in $$props) $$invalidate(5, redirect = $$props.redirect);
    		if ('firstmatch' in $$props) $$invalidate(6, firstmatch = $$props.firstmatch);
    		if ('breadcrumb' in $$props) $$invalidate(7, breadcrumb = $$props.breadcrumb);
    		if ('showContent' in $$props) $$invalidate(0, showContent = $$props.showContent);
    		if ('params' in $$props) $$invalidate(1, params = $$props.params);
    		if ('meta' in $$props) $$invalidate(2, meta = $$props.meta);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, redirect, firstmatch, breadcrumb*/ 232) {
    			route.update({ path, redirect, firstmatch, breadcrumb });
    		}
    	};

    	return [
    		showContent,
    		params,
    		meta,
    		path,
    		fallback,
    		redirect,
    		firstmatch,
    		breadcrumb,
    		$$scope,
    		slots
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$j, create_fragment$j, safe_not_equal, {
    			path: 3,
    			fallback: 4,
    			redirect: 5,
    			firstmatch: 6,
    			breadcrumb: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get fallback() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set fallback(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get redirect() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set redirect(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get firstmatch() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set firstmatch(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get breadcrumb() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set breadcrumb(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    function flip(node, { from, to }, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
        const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
        const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(Math.sqrt(dx * dx + dy * dy)) : duration,
            easing,
            css: (t, u) => {
                const x = u * dx;
                const y = u * dy;
                const sx = t + u * from.width / to.width;
                const sy = t + u * from.height / to.height;
                return `transform: ${transform} translate(${x}px, ${y}px) scale(${sx}, ${sy});`;
            }
        };
    }

    const defaults = {
      duration: 4000,
      initial: 1,
      next: 0,
      pausable: false,
      dismissable: true,
      reversed: false,
      intro: { x: 256 },
      theme: {}
    };

    const createToast = () => {
      const { subscribe, update } = writable([]);
      let count = 0;
      const options = {};
      const _obj = (obj) => obj instanceof Object;
      const push = (msg, opts = {}) => {
        const param = { target: 'default', ...(_obj(msg) ? msg : { ...opts, msg }) };
        const conf = options[param.target] || {};
        const entry = {
          ...defaults,
          ...conf,
          ...param,
          theme: { ...conf.theme, ...param.theme },
          id: ++count
        };
        update((n) => (entry.reversed ? [...n, entry] : [entry, ...n]));
        return count
      };
      const pop = (id) => {
        update((n) => {
          if (!n.length || id === 0) return []
          if (_obj(id)) return n.filter((i) => id(i))
          const target = id || Math.max(...n.map((i) => i.id));
          return n.filter((i) => i.id !== target)
        });
      };
      const set = (id, opts = {}) => {
        const param = _obj(id) ? { ...id } : { ...opts, id };
        update((n) => {
          const idx = n.findIndex((i) => i.id === param.id);
          if (idx > -1) {
            n[idx] = { ...n[idx], ...param };
          }
          return n
        });
      };
      const _init = (target = 'default', opts = {}) => {
        options[target] = opts;
        return options
      };
      return { subscribe, push, pop, set, _init }
    };

    const toast = createToast();

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* node_modules/@zerodevx/svelte-toast/src/ToastItem.svelte generated by Svelte v3.42.5 */
    const file$g = "node_modules/@zerodevx/svelte-toast/src/ToastItem.svelte";

    // (133:4) {:else}
    function create_else_block$9(ctx) {
    	let html_tag;
    	let raw_value = /*item*/ ctx[0].msg + "";
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(raw_value, target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*item*/ 1 && raw_value !== (raw_value = /*item*/ ctx[0].msg + "")) html_tag.p(raw_value);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$9.name,
    		type: "else",
    		source: "(133:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (131:4) {#if item.component}
    function create_if_block_1$5(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	const switch_instance_spread_levels = [/*getProps*/ ctx[6]()];
    	var switch_value = /*item*/ ctx[0].component.src;

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
    	}

    	const block = {
    		c: function create() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert_dev(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const switch_instance_changes = (dirty & /*getProps*/ 64)
    			? get_spread_update(switch_instance_spread_levels, [get_spread_object(/*getProps*/ ctx[6]())])
    			: {};

    			if (switch_value !== (switch_value = /*item*/ ctx[0].component.src)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$5.name,
    		type: "if",
    		source: "(131:4) {#if item.component}",
    		ctx
    	});

    	return block;
    }

    // (137:2) {#if item.dismissable}
    function create_if_block$a(ctx) {
    	let div;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			div.textContent = "✕";
    			attr_dev(div, "class", "_toastBtn pe svelte-j9nwjb");
    			attr_dev(div, "role", "button");
    			attr_dev(div, "tabindex", "-1");
    			add_location(div, file$g, 137, 4, 3562);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*close*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$a.name,
    		type: "if",
    		source: "(137:2) {#if item.dismissable}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div1;
    	let div0;
    	let current_block_type_index;
    	let if_block0;
    	let t0;
    	let t1;
    	let progress_1;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block_1$5, create_else_block$9];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*item*/ ctx[0].component) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	let if_block1 = /*item*/ ctx[0].dismissable && create_if_block$a(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			progress_1 = element("progress");
    			attr_dev(div0, "class", "_toastMsg svelte-j9nwjb");
    			toggle_class(div0, "pe", /*item*/ ctx[0].component);
    			add_location(div0, file$g, 129, 2, 3335);
    			attr_dev(progress_1, "class", "_toastBar svelte-j9nwjb");
    			progress_1.value = /*$progress*/ ctx[1];
    			add_location(progress_1, file$g, 139, 2, 3651);
    			attr_dev(div1, "class", "_toastItem svelte-j9nwjb");
    			toggle_class(div1, "pe", /*item*/ ctx[0].pausable);
    			add_location(div1, file$g, 128, 0, 3238);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if_blocks[current_block_type_index].m(div0, null);
    			append_dev(div1, t0);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, progress_1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "mouseenter", /*pause*/ ctx[4], false, false, false),
    					listen_dev(div1, "mouseleave", /*resume*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block0 = if_blocks[current_block_type_index];

    				if (!if_block0) {
    					if_block0 = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block0.c();
    				} else {
    					if_block0.p(ctx, dirty);
    				}

    				transition_in(if_block0, 1);
    				if_block0.m(div0, null);
    			}

    			if (dirty & /*item*/ 1) {
    				toggle_class(div0, "pe", /*item*/ ctx[0].component);
    			}

    			if (/*item*/ ctx[0].dismissable) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$a(ctx);
    					if_block1.c();
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*$progress*/ 2) {
    				prop_dev(progress_1, "value", /*$progress*/ ctx[1]);
    			}

    			if (dirty & /*item*/ 1) {
    				toggle_class(div1, "pe", /*item*/ ctx[0].pausable);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if_blocks[current_block_type_index].d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $progress;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ToastItem', slots, []);
    	let { item } = $$props;
    	const progress = tweened(item.initial, { duration: item.duration, easing: identity });
    	validate_store(progress, 'progress');
    	component_subscribe($$self, progress, value => $$invalidate(1, $progress = value));
    	const close = () => toast.pop(item.id);

    	const autoclose = () => {
    		if ($progress === 1 || $progress === 0) {
    			close();
    		}
    	};

    	let next = item.initial;
    	let prev = next;
    	let paused = false;

    	const pause = () => {
    		if (item.pausable && !paused && $progress !== next) {
    			progress.set($progress, { duration: 0 });
    			paused = true;
    		}
    	};

    	const resume = () => {
    		if (paused) {
    			const d = item.duration;
    			const duration = d - d * (($progress - prev) / (next - prev));
    			progress.set(next, { duration }).then(autoclose);
    			paused = false;
    		}
    	};

    	const getProps = () => {
    		const { props = {}, sendIdTo } = item.component;

    		if (sendIdTo) {
    			props[sendIdTo] = item.id;
    		}

    		return props;
    	};

    	onDestroy(() => {
    		if (typeof item.onpop === 'function') {
    			item.onpop(item.id);
    		}
    	});

    	const writable_props = ['item'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ToastItem> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		tweened,
    		linear: identity,
    		toast,
    		item,
    		progress,
    		close,
    		autoclose,
    		next,
    		prev,
    		paused,
    		pause,
    		resume,
    		getProps,
    		$progress
    	});

    	$$self.$inject_state = $$props => {
    		if ('item' in $$props) $$invalidate(0, item = $$props.item);
    		if ('next' in $$props) $$invalidate(7, next = $$props.next);
    		if ('prev' in $$props) prev = $$props.prev;
    		if ('paused' in $$props) paused = $$props.paused;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*item*/ 1) {
    			// `progress` has been renamed to `next`; shim included for backward compatibility, to remove in next major
    			if (typeof item.progress !== 'undefined') {
    				$$invalidate(0, item.next = item.progress, item);
    			}
    		}

    		if ($$self.$$.dirty & /*next, item, $progress*/ 131) {
    			if (next !== item.next) {
    				$$invalidate(7, next = item.next);
    				prev = $progress;
    				paused = false;
    				progress.set(next).then(autoclose);
    			}
    		}
    	};

    	return [item, $progress, progress, close, pause, resume, getProps, next];
    }

    class ToastItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { item: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastItem",
    			options,
    			id: create_fragment$i.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*item*/ ctx[0] === undefined && !('item' in props)) {
    			console.warn("<ToastItem> was created without expected prop 'item'");
    		}
    	}

    	get item() {
    		throw new Error("<ToastItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set item(value) {
    		throw new Error("<ToastItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@zerodevx/svelte-toast/src/SvelteToast.svelte generated by Svelte v3.42.5 */

    const { Object: Object_1$4 } = globals;
    const file$f = "node_modules/@zerodevx/svelte-toast/src/SvelteToast.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i];
    	return child_ctx;
    }

    // (34:2) {#each items as item (item.id)}
    function create_each_block$2(key_1, ctx) {
    	let li;
    	let toastitem;
    	let t;
    	let li_style_value;
    	let li_intro;
    	let li_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;

    	toastitem = new ToastItem({
    			props: { item: /*item*/ ctx[5] },
    			$$inline: true
    		});

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			create_component(toastitem.$$.fragment);
    			t = space();
    			attr_dev(li, "style", li_style_value = /*getCss*/ ctx[1](/*item*/ ctx[5].theme));
    			add_location(li, file$f, 34, 4, 815);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(toastitem, li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const toastitem_changes = {};
    			if (dirty & /*items*/ 1) toastitem_changes.item = /*item*/ ctx[5];
    			toastitem.$set(toastitem_changes);

    			if (!current || dirty & /*items*/ 1 && li_style_value !== (li_style_value = /*getCss*/ ctx[1](/*item*/ ctx[5].theme))) {
    				attr_dev(li, "style", li_style_value);
    			}
    		},
    		r: function measure() {
    			rect = li.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(li);
    			stop_animation();
    			add_transform(li, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(li, rect, flip, { duration: 200 });
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastitem.$$.fragment, local);

    			add_render_callback(() => {
    				if (li_outro) li_outro.end(1);
    				li_intro = create_in_transition(li, fly, /*item*/ ctx[5].intro);
    				li_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastitem.$$.fragment, local);
    			if (li_intro) li_intro.invalidate();
    			li_outro = create_out_transition(li, fade, {});
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(toastitem);
    			if (detaching && li_outro) li_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(34:2) {#each items as item (item.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let each_value = /*items*/ ctx[0];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*item*/ ctx[5].id;
    	validate_each_keys(ctx, each_value, get_each_context$2, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context$2(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block$2(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "_toastContainer svelte-7xr3c1");
    			add_location(ul, file$f, 32, 0, 748);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*getCss, items*/ 3) {
    				each_value = /*items*/ ctx[0];
    				validate_each_argument(each_value);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value, get_each_context$2, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, ul, fix_and_outro_and_destroy_block, create_each_block$2, null, get_each_context$2);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let $toast;
    	validate_store(toast, 'toast');
    	component_subscribe($$self, toast, $$value => $$invalidate(4, $toast = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SvelteToast', slots, []);
    	let { options = {} } = $$props;
    	let { target = 'default' } = $$props;
    	let items;
    	const getCss = theme => Object.keys(theme).reduce((a, c) => `${a}${c}:${theme[c]};`, '');
    	const writable_props = ['options', 'target'];

    	Object_1$4.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SvelteToast> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('target' in $$props) $$invalidate(3, target = $$props.target);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		fly,
    		flip,
    		toast,
    		ToastItem,
    		options,
    		target,
    		items,
    		getCss,
    		$toast
    	});

    	$$self.$inject_state = $$props => {
    		if ('options' in $$props) $$invalidate(2, options = $$props.options);
    		if ('target' in $$props) $$invalidate(3, target = $$props.target);
    		if ('items' in $$props) $$invalidate(0, items = $$props.items);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*target, options*/ 12) {
    			toast._init(target, options);
    		}

    		if ($$self.$$.dirty & /*$toast, target*/ 24) {
    			$$invalidate(0, items = $toast.filter(i => i.target === target));
    		}
    	};

    	return [items, getCss, options, target, $toast];
    }

    class SvelteToast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$h, create_fragment$h, safe_not_equal, { options: 2, target: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SvelteToast",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get options() {
    		throw new Error("<SvelteToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set options(value) {
    		throw new Error("<SvelteToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get target() {
    		throw new Error("<SvelteToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set target(value) {
    		throw new Error("<SvelteToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Config = {
        DEBUG: false,
        LIB_VERSION: '2.41.0'
    };

    // since es6 imports are static and we run unit tests from the console, window won't be defined when importing this file
    var window$1;
    if (typeof(window) === 'undefined') {
        var loc = {
            hostname: ''
        };
        window$1 = {
            navigator: { userAgent: '' },
            document: {
                location: loc,
                referrer: ''
            },
            screen: { width: 0, height: 0 },
            location: loc
        };
    } else {
        window$1 = window;
    }

    /*
     * Saved references to long variable names, so that closure compiler can
     * minimize file size.
     */

    var ArrayProto = Array.prototype;
    var FuncProto = Function.prototype;
    var ObjProto = Object.prototype;
    var slice = ArrayProto.slice;
    var toString = ObjProto.toString;
    var hasOwnProperty = ObjProto.hasOwnProperty;
    var windowConsole = window$1.console;
    var navigator$1 = window$1.navigator;
    var document$1 = window$1.document;
    var windowOpera = window$1.opera;
    var screen = window$1.screen;
    var userAgent = navigator$1.userAgent;
    var nativeBind = FuncProto.bind;
    var nativeForEach = ArrayProto.forEach;
    var nativeIndexOf = ArrayProto.indexOf;
    var nativeMap = ArrayProto.map;
    var nativeIsArray = Array.isArray;
    var breaker = {};
    var _ = {
        trim: function(str) {
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/Trim#Polyfill
            return str.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
        }
    };

    // Console override
    var console$1 = {
        /** @type {function(...*)} */
        log: function() {
            if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
                try {
                    windowConsole.log.apply(windowConsole, arguments);
                } catch (err) {
                    _.each(arguments, function(arg) {
                        windowConsole.log(arg);
                    });
                }
            }
        },
        /** @type {function(...*)} */
        warn: function() {
            if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
                var args = ['Mixpanel warning:'].concat(_.toArray(arguments));
                try {
                    windowConsole.warn.apply(windowConsole, args);
                } catch (err) {
                    _.each(args, function(arg) {
                        windowConsole.warn(arg);
                    });
                }
            }
        },
        /** @type {function(...*)} */
        error: function() {
            if (Config.DEBUG && !_.isUndefined(windowConsole) && windowConsole) {
                var args = ['Mixpanel error:'].concat(_.toArray(arguments));
                try {
                    windowConsole.error.apply(windowConsole, args);
                } catch (err) {
                    _.each(args, function(arg) {
                        windowConsole.error(arg);
                    });
                }
            }
        },
        /** @type {function(...*)} */
        critical: function() {
            if (!_.isUndefined(windowConsole) && windowConsole) {
                var args = ['Mixpanel error:'].concat(_.toArray(arguments));
                try {
                    windowConsole.error.apply(windowConsole, args);
                } catch (err) {
                    _.each(args, function(arg) {
                        windowConsole.error(arg);
                    });
                }
            }
        }
    };

    var log_func_with_prefix = function(func, prefix) {
        return function() {
            arguments[0] = '[' + prefix + '] ' + arguments[0];
            return func.apply(console$1, arguments);
        };
    };
    var console_with_prefix = function(prefix) {
        return {
            log: log_func_with_prefix(console$1.log, prefix),
            error: log_func_with_prefix(console$1.error, prefix),
            critical: log_func_with_prefix(console$1.critical, prefix)
        };
    };


    // UNDERSCORE
    // Embed part of the Underscore Library
    _.bind = function(func, context) {
        var args, bound;
        if (nativeBind && func.bind === nativeBind) {
            return nativeBind.apply(func, slice.call(arguments, 1));
        }
        if (!_.isFunction(func)) {
            throw new TypeError();
        }
        args = slice.call(arguments, 2);
        bound = function() {
            if (!(this instanceof bound)) {
                return func.apply(context, args.concat(slice.call(arguments)));
            }
            var ctor = {};
            ctor.prototype = func.prototype;
            var self = new ctor();
            ctor.prototype = null;
            var result = func.apply(self, args.concat(slice.call(arguments)));
            if (Object(result) === result) {
                return result;
            }
            return self;
        };
        return bound;
    };

    _.bind_instance_methods = function(obj) {
        for (var func in obj) {
            if (typeof(obj[func]) === 'function') {
                obj[func] = _.bind(obj[func], obj);
            }
        }
    };

    /**
     * @param {*=} obj
     * @param {function(...*)=} iterator
     * @param {Object=} context
     */
    _.each = function(obj, iterator, context) {
        if (obj === null || obj === undefined) {
            return;
        }
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, l = obj.length; i < l; i++) {
                if (i in obj && iterator.call(context, obj[i], i, obj) === breaker) {
                    return;
                }
            }
        } else {
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) {
                    if (iterator.call(context, obj[key], key, obj) === breaker) {
                        return;
                    }
                }
            }
        }
    };

    _.escapeHTML = function(s) {
        var escaped = s;
        if (escaped && _.isString(escaped)) {
            escaped = escaped
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#039;');
        }
        return escaped;
    };

    _.extend = function(obj) {
        _.each(slice.call(arguments, 1), function(source) {
            for (var prop in source) {
                if (source[prop] !== void 0) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };

    _.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) === '[object Array]';
    };

    // from a comment on http://dbj.org/dbj/?p=286
    // fails on only one very rare and deliberate custom object:
    // var bomb = { toString : undefined, valueOf: function(o) { return "function BOMBA!"; }};
    _.isFunction = function(f) {
        try {
            return /^\s*\bfunction\b/.test(f);
        } catch (x) {
            return false;
        }
    };

    _.isArguments = function(obj) {
        return !!(obj && hasOwnProperty.call(obj, 'callee'));
    };

    _.toArray = function(iterable) {
        if (!iterable) {
            return [];
        }
        if (iterable.toArray) {
            return iterable.toArray();
        }
        if (_.isArray(iterable)) {
            return slice.call(iterable);
        }
        if (_.isArguments(iterable)) {
            return slice.call(iterable);
        }
        return _.values(iterable);
    };

    _.map = function(arr, callback, context) {
        if (nativeMap && arr.map === nativeMap) {
            return arr.map(callback, context);
        } else {
            var results = [];
            _.each(arr, function(item) {
                results.push(callback.call(context, item));
            });
            return results;
        }
    };

    _.keys = function(obj) {
        var results = [];
        if (obj === null) {
            return results;
        }
        _.each(obj, function(value, key) {
            results[results.length] = key;
        });
        return results;
    };

    _.values = function(obj) {
        var results = [];
        if (obj === null) {
            return results;
        }
        _.each(obj, function(value) {
            results[results.length] = value;
        });
        return results;
    };

    _.include = function(obj, target) {
        var found = false;
        if (obj === null) {
            return found;
        }
        if (nativeIndexOf && obj.indexOf === nativeIndexOf) {
            return obj.indexOf(target) != -1;
        }
        _.each(obj, function(value) {
            if (found || (found = (value === target))) {
                return breaker;
            }
        });
        return found;
    };

    _.includes = function(str, needle) {
        return str.indexOf(needle) !== -1;
    };

    // Underscore Addons
    _.inherit = function(subclass, superclass) {
        subclass.prototype = new superclass();
        subclass.prototype.constructor = subclass;
        subclass.superclass = superclass.prototype;
        return subclass;
    };

    _.isObject = function(obj) {
        return (obj === Object(obj) && !_.isArray(obj));
    };

    _.isEmptyObject = function(obj) {
        if (_.isObject(obj)) {
            for (var key in obj) {
                if (hasOwnProperty.call(obj, key)) {
                    return false;
                }
            }
            return true;
        }
        return false;
    };

    _.isUndefined = function(obj) {
        return obj === void 0;
    };

    _.isString = function(obj) {
        return toString.call(obj) == '[object String]';
    };

    _.isDate = function(obj) {
        return toString.call(obj) == '[object Date]';
    };

    _.isNumber = function(obj) {
        return toString.call(obj) == '[object Number]';
    };

    _.isElement = function(obj) {
        return !!(obj && obj.nodeType === 1);
    };

    _.encodeDates = function(obj) {
        _.each(obj, function(v, k) {
            if (_.isDate(v)) {
                obj[k] = _.formatDate(v);
            } else if (_.isObject(v)) {
                obj[k] = _.encodeDates(v); // recurse
            }
        });
        return obj;
    };

    _.timestamp = function() {
        Date.now = Date.now || function() {
            return +new Date;
        };
        return Date.now();
    };

    _.formatDate = function(d) {
        // YYYY-MM-DDTHH:MM:SS in UTC
        function pad(n) {
            return n < 10 ? '0' + n : n;
        }
        return d.getUTCFullYear() + '-' +
            pad(d.getUTCMonth() + 1) + '-' +
            pad(d.getUTCDate()) + 'T' +
            pad(d.getUTCHours()) + ':' +
            pad(d.getUTCMinutes()) + ':' +
            pad(d.getUTCSeconds());
    };

    _.safewrap = function(f) {
        return function() {
            try {
                return f.apply(this, arguments);
            } catch (e) {
                console$1.critical('Implementation error. Please turn on debug and contact support@mixpanel.com.');
                if (Config.DEBUG){
                    console$1.critical(e);
                }
            }
        };
    };

    _.safewrap_class = function(klass, functions) {
        for (var i = 0; i < functions.length; i++) {
            klass.prototype[functions[i]] = _.safewrap(klass.prototype[functions[i]]);
        }
    };

    _.safewrap_instance_methods = function(obj) {
        for (var func in obj) {
            if (typeof(obj[func]) === 'function') {
                obj[func] = _.safewrap(obj[func]);
            }
        }
    };

    _.strip_empty_properties = function(p) {
        var ret = {};
        _.each(p, function(v, k) {
            if (_.isString(v) && v.length > 0) {
                ret[k] = v;
            }
        });
        return ret;
    };

    /*
     * this function returns a copy of object after truncating it.  If
     * passed an Array or Object it will iterate through obj and
     * truncate all the values recursively.
     */
    _.truncate = function(obj, length) {
        var ret;

        if (typeof(obj) === 'string') {
            ret = obj.slice(0, length);
        } else if (_.isArray(obj)) {
            ret = [];
            _.each(obj, function(val) {
                ret.push(_.truncate(val, length));
            });
        } else if (_.isObject(obj)) {
            ret = {};
            _.each(obj, function(val, key) {
                ret[key] = _.truncate(val, length);
            });
        } else {
            ret = obj;
        }

        return ret;
    };

    _.JSONEncode = (function() {
        return function(mixed_val) {
            var value = mixed_val;
            var quote = function(string) {
                var escapable = /[\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g; // eslint-disable-line no-control-regex
                var meta = { // table of character substitutions
                    '\b': '\\b',
                    '\t': '\\t',
                    '\n': '\\n',
                    '\f': '\\f',
                    '\r': '\\r',
                    '"': '\\"',
                    '\\': '\\\\'
                };

                escapable.lastIndex = 0;
                return escapable.test(string) ?
                    '"' + string.replace(escapable, function(a) {
                        var c = meta[a];
                        return typeof c === 'string' ? c :
                            '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                    }) + '"' :
                    '"' + string + '"';
            };

            var str = function(key, holder) {
                var gap = '';
                var indent = '    ';
                var i = 0; // The loop counter.
                var k = ''; // The member key.
                var v = ''; // The member value.
                var length = 0;
                var mind = gap;
                var partial = [];
                var value = holder[key];

                // If the value has a toJSON method, call it to obtain a replacement value.
                if (value && typeof value === 'object' &&
                    typeof value.toJSON === 'function') {
                    value = value.toJSON(key);
                }

                // What happens next depends on the value's type.
                switch (typeof value) {
                    case 'string':
                        return quote(value);

                    case 'number':
                        // JSON numbers must be finite. Encode non-finite numbers as null.
                        return isFinite(value) ? String(value) : 'null';

                    case 'boolean':
                    case 'null':
                        // If the value is a boolean or null, convert it to a string. Note:
                        // typeof null does not produce 'null'. The case is included here in
                        // the remote chance that this gets fixed someday.

                        return String(value);

                    case 'object':
                        // If the type is 'object', we might be dealing with an object or an array or
                        // null.
                        // Due to a specification blunder in ECMAScript, typeof null is 'object',
                        // so watch out for that case.
                        if (!value) {
                            return 'null';
                        }

                        // Make an array to hold the partial results of stringifying this object value.
                        gap += indent;
                        partial = [];

                        // Is the value an array?
                        if (toString.apply(value) === '[object Array]') {
                            // The value is an array. Stringify every element. Use null as a placeholder
                            // for non-JSON values.

                            length = value.length;
                            for (i = 0; i < length; i += 1) {
                                partial[i] = str(i, value) || 'null';
                            }

                            // Join all of the elements together, separated with commas, and wrap them in
                            // brackets.
                            v = partial.length === 0 ? '[]' :
                                gap ? '[\n' + gap +
                                partial.join(',\n' + gap) + '\n' +
                                mind + ']' :
                                    '[' + partial.join(',') + ']';
                            gap = mind;
                            return v;
                        }

                        // Iterate through all of the keys in the object.
                        for (k in value) {
                            if (hasOwnProperty.call(value, k)) {
                                v = str(k, value);
                                if (v) {
                                    partial.push(quote(k) + (gap ? ': ' : ':') + v);
                                }
                            }
                        }

                        // Join all of the member texts together, separated with commas,
                        // and wrap them in braces.
                        v = partial.length === 0 ? '{}' :
                            gap ? '{' + partial.join(',') + '' +
                            mind + '}' : '{' + partial.join(',') + '}';
                        gap = mind;
                        return v;
                }
            };

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.
            return str('', {
                '': value
            });
        };
    })();

    /**
     * From https://github.com/douglascrockford/JSON-js/blob/master/json_parse.js
     * Slightly modified to throw a real Error rather than a POJO
     */
    _.JSONDecode = (function() {
        var at, // The index of the current character
            ch, // The current character
            escapee = {
                '"': '"',
                '\\': '\\',
                '/': '/',
                'b': '\b',
                'f': '\f',
                'n': '\n',
                'r': '\r',
                't': '\t'
            },
            text,
            error = function(m) {
                var e = new SyntaxError(m);
                e.at = at;
                e.text = text;
                throw e;
            },
            next = function(c) {
                // If a c parameter is provided, verify that it matches the current character.
                if (c && c !== ch) {
                    error('Expected \'' + c + '\' instead of \'' + ch + '\'');
                }
                // Get the next character. When there are no more characters,
                // return the empty string.
                ch = text.charAt(at);
                at += 1;
                return ch;
            },
            number = function() {
                // Parse a number value.
                var number,
                    string = '';

                if (ch === '-') {
                    string = '-';
                    next('-');
                }
                while (ch >= '0' && ch <= '9') {
                    string += ch;
                    next();
                }
                if (ch === '.') {
                    string += '.';
                    while (next() && ch >= '0' && ch <= '9') {
                        string += ch;
                    }
                }
                if (ch === 'e' || ch === 'E') {
                    string += ch;
                    next();
                    if (ch === '-' || ch === '+') {
                        string += ch;
                        next();
                    }
                    while (ch >= '0' && ch <= '9') {
                        string += ch;
                        next();
                    }
                }
                number = +string;
                if (!isFinite(number)) {
                    error('Bad number');
                } else {
                    return number;
                }
            },

            string = function() {
                // Parse a string value.
                var hex,
                    i,
                    string = '',
                    uffff;
                // When parsing for string values, we must look for " and \ characters.
                if (ch === '"') {
                    while (next()) {
                        if (ch === '"') {
                            next();
                            return string;
                        }
                        if (ch === '\\') {
                            next();
                            if (ch === 'u') {
                                uffff = 0;
                                for (i = 0; i < 4; i += 1) {
                                    hex = parseInt(next(), 16);
                                    if (!isFinite(hex)) {
                                        break;
                                    }
                                    uffff = uffff * 16 + hex;
                                }
                                string += String.fromCharCode(uffff);
                            } else if (typeof escapee[ch] === 'string') {
                                string += escapee[ch];
                            } else {
                                break;
                            }
                        } else {
                            string += ch;
                        }
                    }
                }
                error('Bad string');
            },
            white = function() {
                // Skip whitespace.
                while (ch && ch <= ' ') {
                    next();
                }
            },
            word = function() {
                // true, false, or null.
                switch (ch) {
                    case 't':
                        next('t');
                        next('r');
                        next('u');
                        next('e');
                        return true;
                    case 'f':
                        next('f');
                        next('a');
                        next('l');
                        next('s');
                        next('e');
                        return false;
                    case 'n':
                        next('n');
                        next('u');
                        next('l');
                        next('l');
                        return null;
                }
                error('Unexpected "' + ch + '"');
            },
            value, // Placeholder for the value function.
            array = function() {
                // Parse an array value.
                var array = [];

                if (ch === '[') {
                    next('[');
                    white();
                    if (ch === ']') {
                        next(']');
                        return array; // empty array
                    }
                    while (ch) {
                        array.push(value());
                        white();
                        if (ch === ']') {
                            next(']');
                            return array;
                        }
                        next(',');
                        white();
                    }
                }
                error('Bad array');
            },
            object = function() {
                // Parse an object value.
                var key,
                    object = {};

                if (ch === '{') {
                    next('{');
                    white();
                    if (ch === '}') {
                        next('}');
                        return object; // empty object
                    }
                    while (ch) {
                        key = string();
                        white();
                        next(':');
                        if (Object.hasOwnProperty.call(object, key)) {
                            error('Duplicate key "' + key + '"');
                        }
                        object[key] = value();
                        white();
                        if (ch === '}') {
                            next('}');
                            return object;
                        }
                        next(',');
                        white();
                    }
                }
                error('Bad object');
            };

        value = function() {
            // Parse a JSON value. It could be an object, an array, a string,
            // a number, or a word.
            white();
            switch (ch) {
                case '{':
                    return object();
                case '[':
                    return array();
                case '"':
                    return string();
                case '-':
                    return number();
                default:
                    return ch >= '0' && ch <= '9' ? number() : word();
            }
        };

        // Return the json_parse function. It will have access to all of the
        // above functions and variables.
        return function(source) {
            var result;

            text = source;
            at = 0;
            ch = ' ';
            result = value();
            white();
            if (ch) {
                error('Syntax error');
            }

            return result;
        };
    })();

    _.base64Encode = function(data) {
        var b64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        var o1, o2, o3, h1, h2, h3, h4, bits, i = 0,
            ac = 0,
            enc = '',
            tmp_arr = [];

        if (!data) {
            return data;
        }

        data = _.utf8Encode(data);

        do { // pack three octets into four hexets
            o1 = data.charCodeAt(i++);
            o2 = data.charCodeAt(i++);
            o3 = data.charCodeAt(i++);

            bits = o1 << 16 | o2 << 8 | o3;

            h1 = bits >> 18 & 0x3f;
            h2 = bits >> 12 & 0x3f;
            h3 = bits >> 6 & 0x3f;
            h4 = bits & 0x3f;

            // use hexets to index into b64, and append result to encoded string
            tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
        } while (i < data.length);

        enc = tmp_arr.join('');

        switch (data.length % 3) {
            case 1:
                enc = enc.slice(0, -2) + '==';
                break;
            case 2:
                enc = enc.slice(0, -1) + '=';
                break;
        }

        return enc;
    };

    _.utf8Encode = function(string) {
        string = (string + '').replace(/\r\n/g, '\n').replace(/\r/g, '\n');

        var utftext = '',
            start,
            end;
        var stringl = 0,
            n;

        start = end = 0;
        stringl = string.length;

        for (n = 0; n < stringl; n++) {
            var c1 = string.charCodeAt(n);
            var enc = null;

            if (c1 < 128) {
                end++;
            } else if ((c1 > 127) && (c1 < 2048)) {
                enc = String.fromCharCode((c1 >> 6) | 192, (c1 & 63) | 128);
            } else {
                enc = String.fromCharCode((c1 >> 12) | 224, ((c1 >> 6) & 63) | 128, (c1 & 63) | 128);
            }
            if (enc !== null) {
                if (end > start) {
                    utftext += string.substring(start, end);
                }
                utftext += enc;
                start = end = n + 1;
            }
        }

        if (end > start) {
            utftext += string.substring(start, string.length);
        }

        return utftext;
    };

    _.UUID = (function() {

        // Time/ticks information
        // 1*new Date() is a cross browser version of Date.now()
        var T = function() {
            var d = 1 * new Date(),
                i = 0;

            // this while loop figures how many browser ticks go by
            // before 1*new Date() returns a new number, ie the amount
            // of ticks that go by per millisecond
            while (d == 1 * new Date()) {
                i++;
            }

            return d.toString(16) + i.toString(16);
        };

        // Math.Random entropy
        var R = function() {
            return Math.random().toString(16).replace('.', '');
        };

        // User agent entropy
        // This function takes the user agent string, and then xors
        // together each sequence of 8 bytes.  This produces a final
        // sequence of 8 bytes which it returns as hex.
        var UA = function() {
            var ua = userAgent,
                i, ch, buffer = [],
                ret = 0;

            function xor(result, byte_array) {
                var j, tmp = 0;
                for (j = 0; j < byte_array.length; j++) {
                    tmp |= (buffer[j] << j * 8);
                }
                return result ^ tmp;
            }

            for (i = 0; i < ua.length; i++) {
                ch = ua.charCodeAt(i);
                buffer.unshift(ch & 0xFF);
                if (buffer.length >= 4) {
                    ret = xor(ret, buffer);
                    buffer = [];
                }
            }

            if (buffer.length > 0) {
                ret = xor(ret, buffer);
            }

            return ret.toString(16);
        };

        return function() {
            var se = (screen.height * screen.width).toString(16);
            return (T() + '-' + R() + '-' + UA() + '-' + se + '-' + T());
        };
    })();

    // _.isBlockedUA()
    // This is to block various web spiders from executing our JS and
    // sending false tracking data
    var BLOCKED_UA_STRS = [
        'baiduspider',
        'bingbot',
        'bingpreview',
        'facebookexternal',
        'pinterest',
        'screaming frog',
        'yahoo! slurp',
        'yandexbot',

        // a whole bunch of goog-specific crawlers
        // https://developers.google.com/search/docs/advanced/crawling/overview-google-crawlers
        'adsbot-google',
        'apis-google',
        'duplexweb-google',
        'feedfetcher-google',
        'google favicon',
        'google web preview',
        'google-read-aloud',
        'googlebot',
        'googleweblight',
        'mediapartners-google',
        'storebot-google'
    ];
    _.isBlockedUA = function(ua) {
        var i;
        ua = ua.toLowerCase();
        for (i = 0; i < BLOCKED_UA_STRS.length; i++) {
            if (ua.indexOf(BLOCKED_UA_STRS[i]) !== -1) {
                return true;
            }
        }
        return false;
    };

    /**
     * @param {Object=} formdata
     * @param {string=} arg_separator
     */
    _.HTTPBuildQuery = function(formdata, arg_separator) {
        var use_val, use_key, tmp_arr = [];

        if (_.isUndefined(arg_separator)) {
            arg_separator = '&';
        }

        _.each(formdata, function(val, key) {
            use_val = encodeURIComponent(val.toString());
            use_key = encodeURIComponent(key);
            tmp_arr[tmp_arr.length] = use_key + '=' + use_val;
        });

        return tmp_arr.join(arg_separator);
    };

    _.getQueryParam = function(url, param) {
        // Expects a raw URL

        param = param.replace(/[[]/, '\\[').replace(/[\]]/, '\\]');
        var regexS = '[\\?&]' + param + '=([^&#]*)',
            regex = new RegExp(regexS),
            results = regex.exec(url);
        if (results === null || (results && typeof(results[1]) !== 'string' && results[1].length)) {
            return '';
        } else {
            var result = results[1];
            try {
                result = decodeURIComponent(result);
            } catch(err) {
                console$1.error('Skipping decoding for malformed query param: ' + result);
            }
            return result.replace(/\+/g, ' ');
        }
    };


    // _.cookie
    // Methods partially borrowed from quirksmode.org/js/cookies.html
    _.cookie = {
        get: function(name) {
            var nameEQ = name + '=';
            var ca = document$1.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1, c.length);
                }
                if (c.indexOf(nameEQ) === 0) {
                    return decodeURIComponent(c.substring(nameEQ.length, c.length));
                }
            }
            return null;
        },

        parse: function(name) {
            var cookie;
            try {
                cookie = _.JSONDecode(_.cookie.get(name)) || {};
            } catch (err) {
                // noop
            }
            return cookie;
        },

        set_seconds: function(name, value, seconds, is_cross_subdomain, is_secure, is_cross_site, domain_override) {
            var cdomain = '',
                expires = '',
                secure = '';

            if (domain_override) {
                cdomain = '; domain=' + domain_override;
            } else if (is_cross_subdomain) {
                var domain = extract_domain(document$1.location.hostname);
                cdomain = domain ? '; domain=.' + domain : '';
            }

            if (seconds) {
                var date = new Date();
                date.setTime(date.getTime() + (seconds * 1000));
                expires = '; expires=' + date.toGMTString();
            }

            if (is_cross_site) {
                is_secure = true;
                secure = '; SameSite=None';
            }
            if (is_secure) {
                secure += '; secure';
            }

            document$1.cookie = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure;
        },

        set: function(name, value, days, is_cross_subdomain, is_secure, is_cross_site, domain_override) {
            var cdomain = '', expires = '', secure = '';

            if (domain_override) {
                cdomain = '; domain=' + domain_override;
            } else if (is_cross_subdomain) {
                var domain = extract_domain(document$1.location.hostname);
                cdomain = domain ? '; domain=.' + domain : '';
            }

            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = '; expires=' + date.toGMTString();
            }

            if (is_cross_site) {
                is_secure = true;
                secure = '; SameSite=None';
            }
            if (is_secure) {
                secure += '; secure';
            }

            var new_cookie_val = name + '=' + encodeURIComponent(value) + expires + '; path=/' + cdomain + secure;
            document$1.cookie = new_cookie_val;
            return new_cookie_val;
        },

        remove: function(name, is_cross_subdomain, domain_override) {
            _.cookie.set(name, '', -1, is_cross_subdomain, false, false, domain_override);
        }
    };

    var _localStorageSupported = null;
    var localStorageSupported = function(storage, forceCheck) {
        if (_localStorageSupported !== null && !forceCheck) {
            return _localStorageSupported;
        }

        var supported = true;
        try {
            storage = storage || window.localStorage;
            var key = '__mplss_' + cheap_guid(8),
                val = 'xyz';
            storage.setItem(key, val);
            if (storage.getItem(key) !== val) {
                supported = false;
            }
            storage.removeItem(key);
        } catch (err) {
            supported = false;
        }

        _localStorageSupported = supported;
        return supported;
    };

    // _.localStorage
    _.localStorage = {
        is_supported: function(force_check) {
            var supported = localStorageSupported(null, force_check);
            if (!supported) {
                console$1.error('localStorage unsupported; falling back to cookie store');
            }
            return supported;
        },

        error: function(msg) {
            console$1.error('localStorage error: ' + msg);
        },

        get: function(name) {
            try {
                return window.localStorage.getItem(name);
            } catch (err) {
                _.localStorage.error(err);
            }
            return null;
        },

        parse: function(name) {
            try {
                return _.JSONDecode(_.localStorage.get(name)) || {};
            } catch (err) {
                // noop
            }
            return null;
        },

        set: function(name, value) {
            try {
                window.localStorage.setItem(name, value);
            } catch (err) {
                _.localStorage.error(err);
            }
        },

        remove: function(name) {
            try {
                window.localStorage.removeItem(name);
            } catch (err) {
                _.localStorage.error(err);
            }
        }
    };

    _.register_event = (function() {
        // written by Dean Edwards, 2005
        // with input from Tino Zijdel - crisp@xs4all.nl
        // with input from Carl Sverre - mail@carlsverre.com
        // with input from Mixpanel
        // http://dean.edwards.name/weblog/2005/10/add-event/
        // https://gist.github.com/1930440

        /**
         * @param {Object} element
         * @param {string} type
         * @param {function(...*)} handler
         * @param {boolean=} oldSchool
         * @param {boolean=} useCapture
         */
        var register_event = function(element, type, handler, oldSchool, useCapture) {
            if (!element) {
                console$1.error('No valid element provided to register_event');
                return;
            }

            if (element.addEventListener && !oldSchool) {
                element.addEventListener(type, handler, !!useCapture);
            } else {
                var ontype = 'on' + type;
                var old_handler = element[ontype]; // can be undefined
                element[ontype] = makeHandler(element, handler, old_handler);
            }
        };

        function makeHandler(element, new_handler, old_handlers) {
            var handler = function(event) {
                event = event || fixEvent(window.event);

                // this basically happens in firefox whenever another script
                // overwrites the onload callback and doesn't pass the event
                // object to previously defined callbacks.  All the browsers
                // that don't define window.event implement addEventListener
                // so the dom_loaded handler will still be fired as usual.
                if (!event) {
                    return undefined;
                }

                var ret = true;
                var old_result, new_result;

                if (_.isFunction(old_handlers)) {
                    old_result = old_handlers(event);
                }
                new_result = new_handler.call(element, event);

                if ((false === old_result) || (false === new_result)) {
                    ret = false;
                }

                return ret;
            };

            return handler;
        }

        function fixEvent(event) {
            if (event) {
                event.preventDefault = fixEvent.preventDefault;
                event.stopPropagation = fixEvent.stopPropagation;
            }
            return event;
        }
        fixEvent.preventDefault = function() {
            this.returnValue = false;
        };
        fixEvent.stopPropagation = function() {
            this.cancelBubble = true;
        };

        return register_event;
    })();


    var TOKEN_MATCH_REGEX = new RegExp('^(\\w*)\\[(\\w+)([=~\\|\\^\\$\\*]?)=?"?([^\\]"]*)"?\\]$');

    _.dom_query = (function() {
        /* document.getElementsBySelector(selector)
        - returns an array of element objects from the current document
        matching the CSS selector. Selectors can contain element names,
        class names and ids and can be nested. For example:

        elements = document.getElementsBySelector('div#main p a.external')

        Will return an array of all 'a' elements with 'external' in their
        class attribute that are contained inside 'p' elements that are
        contained inside the 'div' element which has id="main"

        New in version 0.4: Support for CSS2 and CSS3 attribute selectors:
        See http://www.w3.org/TR/css3-selectors/#attribute-selectors

        Version 0.4 - Simon Willison, March 25th 2003
        -- Works in Phoenix 0.5, Mozilla 1.3, Opera 7, Internet Explorer 6, Internet Explorer 5 on Windows
        -- Opera 7 fails

        Version 0.5 - Carl Sverre, Jan 7th 2013
        -- Now uses jQuery-esque `hasClass` for testing class name
        equality.  This fixes a bug related to '-' characters being
        considered not part of a 'word' in regex.
        */

        function getAllChildren(e) {
            // Returns all children of element. Workaround required for IE5/Windows. Ugh.
            return e.all ? e.all : e.getElementsByTagName('*');
        }

        var bad_whitespace = /[\t\r\n]/g;

        function hasClass(elem, selector) {
            var className = ' ' + selector + ' ';
            return ((' ' + elem.className + ' ').replace(bad_whitespace, ' ').indexOf(className) >= 0);
        }

        function getElementsBySelector(selector) {
            // Attempt to fail gracefully in lesser browsers
            if (!document$1.getElementsByTagName) {
                return [];
            }
            // Split selector in to tokens
            var tokens = selector.split(' ');
            var token, bits, tagName, found, foundCount, i, j, k, elements, currentContextIndex;
            var currentContext = [document$1];
            for (i = 0; i < tokens.length; i++) {
                token = tokens[i].replace(/^\s+/, '').replace(/\s+$/, '');
                if (token.indexOf('#') > -1) {
                    // Token is an ID selector
                    bits = token.split('#');
                    tagName = bits[0];
                    var id = bits[1];
                    var element = document$1.getElementById(id);
                    if (!element || (tagName && element.nodeName.toLowerCase() != tagName)) {
                        // element not found or tag with that ID not found, return false
                        return [];
                    }
                    // Set currentContext to contain just this element
                    currentContext = [element];
                    continue; // Skip to next token
                }
                if (token.indexOf('.') > -1) {
                    // Token contains a class selector
                    bits = token.split('.');
                    tagName = bits[0];
                    var className = bits[1];
                    if (!tagName) {
                        tagName = '*';
                    }
                    // Get elements matching tag, filter them for class selector
                    found = [];
                    foundCount = 0;
                    for (j = 0; j < currentContext.length; j++) {
                        if (tagName == '*') {
                            elements = getAllChildren(currentContext[j]);
                        } else {
                            elements = currentContext[j].getElementsByTagName(tagName);
                        }
                        for (k = 0; k < elements.length; k++) {
                            found[foundCount++] = elements[k];
                        }
                    }
                    currentContext = [];
                    currentContextIndex = 0;
                    for (j = 0; j < found.length; j++) {
                        if (found[j].className &&
                            _.isString(found[j].className) && // some SVG elements have classNames which are not strings
                            hasClass(found[j], className)
                        ) {
                            currentContext[currentContextIndex++] = found[j];
                        }
                    }
                    continue; // Skip to next token
                }
                // Code to deal with attribute selectors
                var token_match = token.match(TOKEN_MATCH_REGEX);
                if (token_match) {
                    tagName = token_match[1];
                    var attrName = token_match[2];
                    var attrOperator = token_match[3];
                    var attrValue = token_match[4];
                    if (!tagName) {
                        tagName = '*';
                    }
                    // Grab all of the tagName elements within current context
                    found = [];
                    foundCount = 0;
                    for (j = 0; j < currentContext.length; j++) {
                        if (tagName == '*') {
                            elements = getAllChildren(currentContext[j]);
                        } else {
                            elements = currentContext[j].getElementsByTagName(tagName);
                        }
                        for (k = 0; k < elements.length; k++) {
                            found[foundCount++] = elements[k];
                        }
                    }
                    currentContext = [];
                    currentContextIndex = 0;
                    var checkFunction; // This function will be used to filter the elements
                    switch (attrOperator) {
                        case '=': // Equality
                            checkFunction = function(e) {
                                return (e.getAttribute(attrName) == attrValue);
                            };
                            break;
                        case '~': // Match one of space seperated words
                            checkFunction = function(e) {
                                return (e.getAttribute(attrName).match(new RegExp('\\b' + attrValue + '\\b')));
                            };
                            break;
                        case '|': // Match start with value followed by optional hyphen
                            checkFunction = function(e) {
                                return (e.getAttribute(attrName).match(new RegExp('^' + attrValue + '-?')));
                            };
                            break;
                        case '^': // Match starts with value
                            checkFunction = function(e) {
                                return (e.getAttribute(attrName).indexOf(attrValue) === 0);
                            };
                            break;
                        case '$': // Match ends with value - fails with "Warning" in Opera 7
                            checkFunction = function(e) {
                                return (e.getAttribute(attrName).lastIndexOf(attrValue) == e.getAttribute(attrName).length - attrValue.length);
                            };
                            break;
                        case '*': // Match ends with value
                            checkFunction = function(e) {
                                return (e.getAttribute(attrName).indexOf(attrValue) > -1);
                            };
                            break;
                        default:
                            // Just test for existence of attribute
                            checkFunction = function(e) {
                                return e.getAttribute(attrName);
                            };
                    }
                    currentContext = [];
                    currentContextIndex = 0;
                    for (j = 0; j < found.length; j++) {
                        if (checkFunction(found[j])) {
                            currentContext[currentContextIndex++] = found[j];
                        }
                    }
                    // alert('Attribute Selector: '+tagName+' '+attrName+' '+attrOperator+' '+attrValue);
                    continue; // Skip to next token
                }
                // If we get here, token is JUST an element (not a class or ID selector)
                tagName = token;
                found = [];
                foundCount = 0;
                for (j = 0; j < currentContext.length; j++) {
                    elements = currentContext[j].getElementsByTagName(tagName);
                    for (k = 0; k < elements.length; k++) {
                        found[foundCount++] = elements[k];
                    }
                }
                currentContext = found;
            }
            return currentContext;
        }

        return function(query) {
            if (_.isElement(query)) {
                return [query];
            } else if (_.isObject(query) && !_.isUndefined(query.length)) {
                return query;
            } else {
                return getElementsBySelector.call(this, query);
            }
        };
    })();

    _.info = {
        campaignParams: function() {
            var campaign_keywords = 'utm_source utm_medium utm_campaign utm_content utm_term'.split(' '),
                kw = '',
                params = {};
            _.each(campaign_keywords, function(kwkey) {
                kw = _.getQueryParam(document$1.URL, kwkey);
                if (kw.length) {
                    params[kwkey] = kw;
                }
            });

            return params;
        },

        searchEngine: function(referrer) {
            if (referrer.search('https?://(.*)google.([^/?]*)') === 0) {
                return 'google';
            } else if (referrer.search('https?://(.*)bing.com') === 0) {
                return 'bing';
            } else if (referrer.search('https?://(.*)yahoo.com') === 0) {
                return 'yahoo';
            } else if (referrer.search('https?://(.*)duckduckgo.com') === 0) {
                return 'duckduckgo';
            } else {
                return null;
            }
        },

        searchInfo: function(referrer) {
            var search = _.info.searchEngine(referrer),
                param = (search != 'yahoo') ? 'q' : 'p',
                ret = {};

            if (search !== null) {
                ret['$search_engine'] = search;

                var keyword = _.getQueryParam(referrer, param);
                if (keyword.length) {
                    ret['mp_keyword'] = keyword;
                }
            }

            return ret;
        },

        /**
         * This function detects which browser is running this script.
         * The order of the checks are important since many user agents
         * include key words used in later checks.
         */
        browser: function(user_agent, vendor, opera) {
            vendor = vendor || ''; // vendor is undefined for at least IE9
            if (opera || _.includes(user_agent, ' OPR/')) {
                if (_.includes(user_agent, 'Mini')) {
                    return 'Opera Mini';
                }
                return 'Opera';
            } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
                return 'BlackBerry';
            } else if (_.includes(user_agent, 'IEMobile') || _.includes(user_agent, 'WPDesktop')) {
                return 'Internet Explorer Mobile';
            } else if (_.includes(user_agent, 'SamsungBrowser/')) {
                // https://developer.samsung.com/internet/user-agent-string-format
                return 'Samsung Internet';
            } else if (_.includes(user_agent, 'Edge') || _.includes(user_agent, 'Edg/')) {
                return 'Microsoft Edge';
            } else if (_.includes(user_agent, 'FBIOS')) {
                return 'Facebook Mobile';
            } else if (_.includes(user_agent, 'Chrome')) {
                return 'Chrome';
            } else if (_.includes(user_agent, 'CriOS')) {
                return 'Chrome iOS';
            } else if (_.includes(user_agent, 'UCWEB') || _.includes(user_agent, 'UCBrowser')) {
                return 'UC Browser';
            } else if (_.includes(user_agent, 'FxiOS')) {
                return 'Firefox iOS';
            } else if (_.includes(vendor, 'Apple')) {
                if (_.includes(user_agent, 'Mobile')) {
                    return 'Mobile Safari';
                }
                return 'Safari';
            } else if (_.includes(user_agent, 'Android')) {
                return 'Android Mobile';
            } else if (_.includes(user_agent, 'Konqueror')) {
                return 'Konqueror';
            } else if (_.includes(user_agent, 'Firefox')) {
                return 'Firefox';
            } else if (_.includes(user_agent, 'MSIE') || _.includes(user_agent, 'Trident/')) {
                return 'Internet Explorer';
            } else if (_.includes(user_agent, 'Gecko')) {
                return 'Mozilla';
            } else {
                return '';
            }
        },

        /**
         * This function detects which browser version is running this script,
         * parsing major and minor version (e.g., 42.1). User agent strings from:
         * http://www.useragentstring.com/pages/useragentstring.php
         */
        browserVersion: function(userAgent, vendor, opera) {
            var browser = _.info.browser(userAgent, vendor, opera);
            var versionRegexs = {
                'Internet Explorer Mobile': /rv:(\d+(\.\d+)?)/,
                'Microsoft Edge': /Edge?\/(\d+(\.\d+)?)/,
                'Chrome': /Chrome\/(\d+(\.\d+)?)/,
                'Chrome iOS': /CriOS\/(\d+(\.\d+)?)/,
                'UC Browser' : /(UCBrowser|UCWEB)\/(\d+(\.\d+)?)/,
                'Safari': /Version\/(\d+(\.\d+)?)/,
                'Mobile Safari': /Version\/(\d+(\.\d+)?)/,
                'Opera': /(Opera|OPR)\/(\d+(\.\d+)?)/,
                'Firefox': /Firefox\/(\d+(\.\d+)?)/,
                'Firefox iOS': /FxiOS\/(\d+(\.\d+)?)/,
                'Konqueror': /Konqueror:(\d+(\.\d+)?)/,
                'BlackBerry': /BlackBerry (\d+(\.\d+)?)/,
                'Android Mobile': /android\s(\d+(\.\d+)?)/,
                'Samsung Internet': /SamsungBrowser\/(\d+(\.\d+)?)/,
                'Internet Explorer': /(rv:|MSIE )(\d+(\.\d+)?)/,
                'Mozilla': /rv:(\d+(\.\d+)?)/
            };
            var regex = versionRegexs[browser];
            if (regex === undefined) {
                return null;
            }
            var matches = userAgent.match(regex);
            if (!matches) {
                return null;
            }
            return parseFloat(matches[matches.length - 2]);
        },

        os: function() {
            var a = userAgent;
            if (/Windows/i.test(a)) {
                if (/Phone/.test(a) || /WPDesktop/.test(a)) {
                    return 'Windows Phone';
                }
                return 'Windows';
            } else if (/(iPhone|iPad|iPod)/.test(a)) {
                return 'iOS';
            } else if (/Android/.test(a)) {
                return 'Android';
            } else if (/(BlackBerry|PlayBook|BB10)/i.test(a)) {
                return 'BlackBerry';
            } else if (/Mac/i.test(a)) {
                return 'Mac OS X';
            } else if (/Linux/.test(a)) {
                return 'Linux';
            } else if (/CrOS/.test(a)) {
                return 'Chrome OS';
            } else {
                return '';
            }
        },

        device: function(user_agent) {
            if (/Windows Phone/i.test(user_agent) || /WPDesktop/.test(user_agent)) {
                return 'Windows Phone';
            } else if (/iPad/.test(user_agent)) {
                return 'iPad';
            } else if (/iPod/.test(user_agent)) {
                return 'iPod Touch';
            } else if (/iPhone/.test(user_agent)) {
                return 'iPhone';
            } else if (/(BlackBerry|PlayBook|BB10)/i.test(user_agent)) {
                return 'BlackBerry';
            } else if (/Android/.test(user_agent)) {
                return 'Android';
            } else {
                return '';
            }
        },

        referringDomain: function(referrer) {
            var split = referrer.split('/');
            if (split.length >= 3) {
                return split[2];
            }
            return '';
        },

        properties: function() {
            return _.extend(_.strip_empty_properties({
                '$os': _.info.os(),
                '$browser': _.info.browser(userAgent, navigator$1.vendor, windowOpera),
                '$referrer': document$1.referrer,
                '$referring_domain': _.info.referringDomain(document$1.referrer),
                '$device': _.info.device(userAgent)
            }), {
                '$current_url': window$1.location.href,
                '$browser_version': _.info.browserVersion(userAgent, navigator$1.vendor, windowOpera),
                '$screen_height': screen.height,
                '$screen_width': screen.width,
                'mp_lib': 'web',
                '$lib_version': Config.LIB_VERSION,
                '$insert_id': cheap_guid(),
                'time': _.timestamp() / 1000 // epoch time in seconds
            });
        },

        people_properties: function() {
            return _.extend(_.strip_empty_properties({
                '$os': _.info.os(),
                '$browser': _.info.browser(userAgent, navigator$1.vendor, windowOpera)
            }), {
                '$browser_version': _.info.browserVersion(userAgent, navigator$1.vendor, windowOpera)
            });
        },

        pageviewInfo: function(page) {
            return _.strip_empty_properties({
                'mp_page': page,
                'mp_referrer': document$1.referrer,
                'mp_browser': _.info.browser(userAgent, navigator$1.vendor, windowOpera),
                'mp_platform': _.info.os()
            });
        }
    };

    var cheap_guid = function(maxlen) {
        var guid = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
        return maxlen ? guid.substring(0, maxlen) : guid;
    };

    /**
     * Check deterministically whether to include or exclude from a feature rollout/test based on the
     * given string and the desired percentage to include.
     * @param {String} str - string to run the check against (for instance a project's token)
     * @param {String} feature - name of feature (for inclusion in hash, to ensure different results
     * for different features)
     * @param {Number} percent_allowed - percentage chance that a given string will be included
     * @returns {Boolean} whether the given string should be included
     */
    var determine_eligibility = _.safewrap(function(str, feature, percent_allowed) {
        str = str + feature;

        // Bernstein's hash: http://www.cse.yorku.ca/~oz/hash.html#djb2
        var hash = 5381;
        for (var i = 0; i < str.length; i++) {
            hash = ((hash << 5) + hash) + str.charCodeAt(i);
            hash = hash & hash;
        }
        var dart = (hash >>> 0) % 100;
        return dart < percent_allowed;
    });

    // naive way to extract domain name (example.com) from full hostname (my.sub.example.com)
    var SIMPLE_DOMAIN_MATCH_REGEX = /[a-z0-9][a-z0-9-]*\.[a-z]+$/i;
    // this next one attempts to account for some ccSLDs, e.g. extracting oxford.ac.uk from www.oxford.ac.uk
    var DOMAIN_MATCH_REGEX = /[a-z0-9][a-z0-9-]+\.[a-z.]{2,6}$/i;
    /**
     * Attempts to extract main domain name from full hostname, using a few blunt heuristics. For
     * common TLDs like .com/.org that always have a simple SLD.TLD structure (example.com), we
     * simply extract the last two .-separated parts of the hostname (SIMPLE_DOMAIN_MATCH_REGEX).
     * For others, we attempt to account for short ccSLD+TLD combos (.ac.uk) with the legacy
     * DOMAIN_MATCH_REGEX (kept to maintain backwards compatibility with existing Mixpanel
     * integrations). The only _reliable_ way to extract domain from hostname is with an up-to-date
     * list like at https://publicsuffix.org/ so for cases that this helper fails at, the SDK
     * offers the 'cookie_domain' config option to set it explicitly.
     * @example
     * extract_domain('my.sub.example.com')
     * // 'example.com'
     */
    var extract_domain = function(hostname) {
        var domain_regex = DOMAIN_MATCH_REGEX;
        var parts = hostname.split('.');
        var tld = parts[parts.length - 1];
        if (tld.length > 4 || tld === 'com' || tld === 'org') {
            domain_regex = SIMPLE_DOMAIN_MATCH_REGEX;
        }
        var matches = hostname.match(domain_regex);
        return matches ? matches[0] : '';
    };

    var JSONStringify = null;
    var JSONParse = null;
    if (typeof JSON !== 'undefined') {
        JSONStringify = JSON.stringify;
        JSONParse = JSON.parse;
    }
    JSONStringify = JSONStringify || _.JSONEncode;
    JSONParse = JSONParse || _.JSONDecode;

    // EXPORTS (for closure compiler)
    _['toArray']                = _.toArray;
    _['isObject']               = _.isObject;
    _['JSONEncode']             = _.JSONEncode;
    _['JSONDecode']             = _.JSONDecode;
    _['isBlockedUA']            = _.isBlockedUA;
    _['isEmptyObject']          = _.isEmptyObject;
    _['info']                   = _.info;
    _['info']['device']         = _.info.device;
    _['info']['browser']        = _.info.browser;
    _['info']['browserVersion'] = _.info.browserVersion;
    _['info']['properties']     = _.info.properties;

    /**
     * DomTracker Object
     * @constructor
     */
    var DomTracker = function() {};


    // interface
    DomTracker.prototype.create_properties = function() {};
    DomTracker.prototype.event_handler = function() {};
    DomTracker.prototype.after_track_handler = function() {};

    DomTracker.prototype.init = function(mixpanel_instance) {
        this.mp = mixpanel_instance;
        return this;
    };

    /**
     * @param {Object|string} query
     * @param {string} event_name
     * @param {Object=} properties
     * @param {function=} user_callback
     */
    DomTracker.prototype.track = function(query, event_name, properties, user_callback) {
        var that = this;
        var elements = _.dom_query(query);

        if (elements.length === 0) {
            console$1.error('The DOM query (' + query + ') returned 0 elements');
            return;
        }

        _.each(elements, function(element) {
            _.register_event(element, this.override_event, function(e) {
                var options = {};
                var props = that.create_properties(properties, this);
                var timeout = that.mp.get_config('track_links_timeout');

                that.event_handler(e, this, options);

                // in case the mixpanel servers don't get back to us in time
                window.setTimeout(that.track_callback(user_callback, props, options, true), timeout);

                // fire the tracking event
                that.mp.track(event_name, props, that.track_callback(user_callback, props, options));
            });
        }, this);

        return true;
    };

    /**
     * @param {function} user_callback
     * @param {Object} props
     * @param {boolean=} timeout_occured
     */
    DomTracker.prototype.track_callback = function(user_callback, props, options, timeout_occured) {
        timeout_occured = timeout_occured || false;
        var that = this;

        return function() {
            // options is referenced from both callbacks, so we can have
            // a 'lock' of sorts to ensure only one fires
            if (options.callback_fired) { return; }
            options.callback_fired = true;

            if (user_callback && user_callback(timeout_occured, props) === false) {
                // user can prevent the default functionality by
                // returning false from their callback
                return;
            }

            that.after_track_handler(props, options, timeout_occured);
        };
    };

    DomTracker.prototype.create_properties = function(properties, element) {
        var props;

        if (typeof(properties) === 'function') {
            props = properties(element);
        } else {
            props = _.extend({}, properties);
        }

        return props;
    };

    /**
     * LinkTracker Object
     * @constructor
     * @extends DomTracker
     */
    var LinkTracker = function() {
        this.override_event = 'click';
    };
    _.inherit(LinkTracker, DomTracker);

    LinkTracker.prototype.create_properties = function(properties, element) {
        var props = LinkTracker.superclass.create_properties.apply(this, arguments);

        if (element.href) { props['url'] = element.href; }

        return props;
    };

    LinkTracker.prototype.event_handler = function(evt, element, options) {
        options.new_tab = (
            evt.which === 2 ||
            evt.metaKey ||
            evt.ctrlKey ||
            element.target === '_blank'
        );
        options.href = element.href;

        if (!options.new_tab) {
            evt.preventDefault();
        }
    };

    LinkTracker.prototype.after_track_handler = function(props, options) {
        if (options.new_tab) { return; }

        setTimeout(function() {
            window.location = options.href;
        }, 0);
    };

    /**
     * FormTracker Object
     * @constructor
     * @extends DomTracker
     */
    var FormTracker = function() {
        this.override_event = 'submit';
    };
    _.inherit(FormTracker, DomTracker);

    FormTracker.prototype.event_handler = function(evt, element, options) {
        options.element = element;
        evt.preventDefault();
    };

    FormTracker.prototype.after_track_handler = function(props, options) {
        setTimeout(function() {
            options.element.submit();
        }, 0);
    };

    // eslint-disable-line camelcase

    var logger$2 = console_with_prefix('lock');

    /**
     * SharedLock: a mutex built on HTML5 localStorage, to ensure that only one browser
     * window/tab at a time will be able to access shared resources.
     *
     * Based on the Alur and Taubenfeld fast lock
     * (http://www.cs.rochester.edu/research/synchronization/pseudocode/fastlock.html)
     * with an added timeout to ensure there will be eventual progress in the event
     * that a window is closed in the middle of the callback.
     *
     * Implementation based on the original version by David Wolever (https://github.com/wolever)
     * at https://gist.github.com/wolever/5fd7573d1ef6166e8f8c4af286a69432.
     *
     * @example
     * const myLock = new SharedLock('some-key');
     * myLock.withLock(function() {
     *   console.log('I hold the mutex!');
     * });
     *
     * @constructor
     */
    var SharedLock = function(key, options) {
        options = options || {};

        this.storageKey = key;
        this.storage = options.storage || window.localStorage;
        this.pollIntervalMS = options.pollIntervalMS || 100;
        this.timeoutMS = options.timeoutMS || 2000;
    };

    // pass in a specific pid to test contention scenarios; otherwise
    // it is chosen randomly for each acquisition attempt
    SharedLock.prototype.withLock = function(lockedCB, errorCB, pid) {
        if (!pid && typeof errorCB !== 'function') {
            pid = errorCB;
            errorCB = null;
        }

        var i = pid || (new Date().getTime() + '|' + Math.random());
        var startTime = new Date().getTime();

        var key = this.storageKey;
        var pollIntervalMS = this.pollIntervalMS;
        var timeoutMS = this.timeoutMS;
        var storage = this.storage;

        var keyX = key + ':X';
        var keyY = key + ':Y';
        var keyZ = key + ':Z';

        var reportError = function(err) {
            errorCB && errorCB(err);
        };

        var delay = function(cb) {
            if (new Date().getTime() - startTime > timeoutMS) {
                logger$2.error('Timeout waiting for mutex on ' + key + '; clearing lock. [' + i + ']');
                storage.removeItem(keyZ);
                storage.removeItem(keyY);
                loop();
                return;
            }
            setTimeout(function() {
                try {
                    cb();
                } catch(err) {
                    reportError(err);
                }
            }, pollIntervalMS * (Math.random() + 0.1));
        };

        var waitFor = function(predicate, cb) {
            if (predicate()) {
                cb();
            } else {
                delay(function() {
                    waitFor(predicate, cb);
                });
            }
        };

        var getSetY = function() {
            var valY = storage.getItem(keyY);
            if (valY && valY !== i) { // if Y == i then this process already has the lock (useful for test cases)
                return false;
            } else {
                storage.setItem(keyY, i);
                if (storage.getItem(keyY) === i) {
                    return true;
                } else {
                    if (!localStorageSupported(storage, true)) {
                        throw new Error('localStorage support dropped while acquiring lock');
                    }
                    return false;
                }
            }
        };

        var loop = function() {
            storage.setItem(keyX, i);

            waitFor(getSetY, function() {
                if (storage.getItem(keyX) === i) {
                    criticalSection();
                    return;
                }

                delay(function() {
                    if (storage.getItem(keyY) !== i) {
                        loop();
                        return;
                    }
                    waitFor(function() {
                        return !storage.getItem(keyZ);
                    }, criticalSection);
                });
            });
        };

        var criticalSection = function() {
            storage.setItem(keyZ, '1');
            try {
                lockedCB();
            } finally {
                storage.removeItem(keyZ);
                if (storage.getItem(keyY) === i) {
                    storage.removeItem(keyY);
                }
                if (storage.getItem(keyX) === i) {
                    storage.removeItem(keyX);
                }
            }
        };

        try {
            if (localStorageSupported(storage, true)) {
                loop();
            } else {
                throw new Error('localStorage support check failed');
            }
        } catch(err) {
            reportError(err);
        }
    };

    // eslint-disable-line camelcase

    var logger$1 = console_with_prefix('batch');

    /**
     * RequestQueue: queue for batching API requests with localStorage backup for retries.
     * Maintains an in-memory queue which represents the source of truth for the current
     * page, but also writes all items out to a copy in the browser's localStorage, which
     * can be read on subsequent pageloads and retried. For batchability, all the request
     * items in the queue should be of the same type (events, people updates, group updates)
     * so they can be sent in a single request to the same API endpoint.
     *
     * LocalStorage keying and locking: In order for reloads and subsequent pageloads of
     * the same site to access the same persisted data, they must share the same localStorage
     * key (for instance based on project token and queue type). Therefore access to the
     * localStorage entry is guarded by an asynchronous mutex (SharedLock) to prevent
     * simultaneously open windows/tabs from overwriting each other's data (which would lead
     * to data loss in some situations).
     * @constructor
     */
    var RequestQueue = function(storageKey, options) {
        options = options || {};
        this.storageKey = storageKey;
        this.storage = options.storage || window.localStorage;
        this.lock = new SharedLock(storageKey, {storage: this.storage});

        this.pid = options.pid || null; // pass pid to test out storage lock contention scenarios

        this.memQueue = [];
    };

    /**
     * Add one item to queues (memory and localStorage). The queued entry includes
     * the given item along with an auto-generated ID and a "flush-after" timestamp.
     * It is expected that the item will be sent over the network and dequeued
     * before the flush-after time; if this doesn't happen it is considered orphaned
     * (e.g., the original tab where it was enqueued got closed before it could be
     * sent) and the item can be sent by any tab that finds it in localStorage.
     *
     * The final callback param is called with a param indicating success or
     * failure of the enqueue operation; it is asynchronous because the localStorage
     * lock is asynchronous.
     */
    RequestQueue.prototype.enqueue = function(item, flushInterval, cb) {
        var queueEntry = {
            'id': cheap_guid(),
            'flushAfter': new Date().getTime() + flushInterval * 2,
            'payload': item
        };

        this.lock.withLock(_.bind(function lockAcquired() {
            var succeeded;
            try {
                var storedQueue = this.readFromStorage();
                storedQueue.push(queueEntry);
                succeeded = this.saveToStorage(storedQueue);
                if (succeeded) {
                    // only add to in-memory queue when storage succeeds
                    this.memQueue.push(queueEntry);
                }
            } catch(err) {
                logger$1.error('Error enqueueing item', item);
                succeeded = false;
            }
            if (cb) {
                cb(succeeded);
            }
        }, this), function lockFailure(err) {
            logger$1.error('Error acquiring storage lock', err);
            if (cb) {
                cb(false);
            }
        }, this.pid);
    };

    /**
     * Read out the given number of queue entries. If this.memQueue
     * has fewer than batchSize items, then look for "orphaned" items
     * in the persisted queue (items where the 'flushAfter' time has
     * already passed).
     */
    RequestQueue.prototype.fillBatch = function(batchSize) {
        var batch = this.memQueue.slice(0, batchSize);
        if (batch.length < batchSize) {
            // don't need lock just to read events; localStorage is thread-safe
            // and the worst that could happen is a duplicate send of some
            // orphaned events, which will be deduplicated on the server side
            var storedQueue = this.readFromStorage();
            if (storedQueue.length) {
                // item IDs already in batch; don't duplicate out of storage
                var idsInBatch = {}; // poor man's Set
                _.each(batch, function(item) { idsInBatch[item['id']] = true; });

                for (var i = 0; i < storedQueue.length; i++) {
                    var item = storedQueue[i];
                    if (new Date().getTime() > item['flushAfter'] && !idsInBatch[item['id']]) {
                        item.orphaned = true;
                        batch.push(item);
                        if (batch.length >= batchSize) {
                            break;
                        }
                    }
                }
            }
        }
        return batch;
    };

    /**
     * Remove items with matching 'id' from array (immutably)
     * also remove any item without a valid id (e.g., malformed
     * storage entries).
     */
    var filterOutIDsAndInvalid = function(items, idSet) {
        var filteredItems = [];
        _.each(items, function(item) {
            if (item['id'] && !idSet[item['id']]) {
                filteredItems.push(item);
            }
        });
        return filteredItems;
    };

    /**
     * Remove items with matching IDs from both in-memory queue
     * and persisted queue
     */
    RequestQueue.prototype.removeItemsByID = function(ids, cb) {
        var idSet = {}; // poor man's Set
        _.each(ids, function(id) { idSet[id] = true; });

        this.memQueue = filterOutIDsAndInvalid(this.memQueue, idSet);
        this.lock.withLock(_.bind(function lockAcquired() {
            var succeeded;
            try {
                var storedQueue = this.readFromStorage();
                storedQueue = filterOutIDsAndInvalid(storedQueue, idSet);
                succeeded = this.saveToStorage(storedQueue);
            } catch(err) {
                logger$1.error('Error removing items', ids);
                succeeded = false;
            }
            if (cb) {
                cb(succeeded);
            }
        }, this), function lockFailure(err) {
            logger$1.error('Error acquiring storage lock', err);
            if (cb) {
                cb(false);
            }
        }, this.pid);
    };

    // internal helper for RequestQueue.updatePayloads
    var updatePayloads = function(existingItems, itemsToUpdate) {
        var newItems = [];
        _.each(existingItems, function(item) {
            var id = item['id'];
            if (id in itemsToUpdate) {
                var newPayload = itemsToUpdate[id];
                if (newPayload !== null) {
                    item['payload'] = newPayload;
                    newItems.push(item);
                }
            } else {
                // no update
                newItems.push(item);
            }
        });
        return newItems;
    };

    /**
     * Update payloads of given items in both in-memory queue and
     * persisted queue. Items set to null are removed from queues.
     */
    RequestQueue.prototype.updatePayloads = function(itemsToUpdate, cb) {
        this.memQueue = updatePayloads(this.memQueue, itemsToUpdate);
        this.lock.withLock(_.bind(function lockAcquired() {
            var succeeded;
            try {
                var storedQueue = this.readFromStorage();
                storedQueue = updatePayloads(storedQueue, itemsToUpdate);
                succeeded = this.saveToStorage(storedQueue);
            } catch(err) {
                logger$1.error('Error updating items', itemsToUpdate);
                succeeded = false;
            }
            if (cb) {
                cb(succeeded);
            }
        }, this), function lockFailure(err) {
            logger$1.error('Error acquiring storage lock', err);
            if (cb) {
                cb(false);
            }
        }, this.pid);
    };

    /**
     * Read and parse items array from localStorage entry, handling
     * malformed/missing data if necessary.
     */
    RequestQueue.prototype.readFromStorage = function() {
        var storageEntry;
        try {
            storageEntry = this.storage.getItem(this.storageKey);
            if (storageEntry) {
                storageEntry = JSONParse(storageEntry);
                if (!_.isArray(storageEntry)) {
                    logger$1.error('Invalid storage entry:', storageEntry);
                    storageEntry = null;
                }
            }
        } catch (err) {
            logger$1.error('Error retrieving queue', err);
            storageEntry = null;
        }
        return storageEntry || [];
    };

    /**
     * Serialize the given items array to localStorage.
     */
    RequestQueue.prototype.saveToStorage = function(queue) {
        try {
            this.storage.setItem(this.storageKey, JSONStringify(queue));
            return true;
        } catch (err) {
            logger$1.error('Error saving queue', err);
            return false;
        }
    };

    /**
     * Clear out queues (memory and localStorage).
     */
    RequestQueue.prototype.clear = function() {
        this.memQueue = [];
        this.storage.removeItem(this.storageKey);
    };

    // eslint-disable-line camelcase

    // maximum interval between request retries after exponential backoff
    var MAX_RETRY_INTERVAL_MS = 10 * 60 * 1000; // 10 minutes

    var logger = console_with_prefix('batch');

    /**
     * RequestBatcher: manages the queueing, flushing, retry etc of requests of one
     * type (events, people, groups).
     * Uses RequestQueue to manage the backing store.
     * @constructor
     */
    var RequestBatcher = function(storageKey, options) {
        this.queue = new RequestQueue(storageKey, {storage: options.storage});

        this.libConfig = options.libConfig;
        this.sendRequest = options.sendRequestFunc;
        this.beforeSendHook = options.beforeSendHook;

        // seed variable batch size + flush interval with configured values
        this.batchSize = this.libConfig['batch_size'];
        this.flushInterval = this.libConfig['batch_flush_interval_ms'];

        this.stopped = !this.libConfig['batch_autostart'];
    };

    /**
     * Add one item to queue.
     */
    RequestBatcher.prototype.enqueue = function(item, cb) {
        this.queue.enqueue(item, this.flushInterval, cb);
    };

    /**
     * Start flushing batches at the configured time interval. Must call
     * this method upon SDK init in order to send anything over the network.
     */
    RequestBatcher.prototype.start = function() {
        this.stopped = false;
        this.flush();
    };

    /**
     * Stop flushing batches. Can be restarted by calling start().
     */
    RequestBatcher.prototype.stop = function() {
        this.stopped = true;
        if (this.timeoutID) {
            clearTimeout(this.timeoutID);
            this.timeoutID = null;
        }
    };

    /**
     * Clear out queue.
     */
    RequestBatcher.prototype.clear = function() {
        this.queue.clear();
    };

    /**
     * Restore batch size configuration to whatever is set in the main SDK.
     */
    RequestBatcher.prototype.resetBatchSize = function() {
        this.batchSize = this.libConfig['batch_size'];
    };

    /**
     * Restore flush interval time configuration to whatever is set in the main SDK.
     */
    RequestBatcher.prototype.resetFlush = function() {
        this.scheduleFlush(this.libConfig['batch_flush_interval_ms']);
    };

    /**
     * Schedule the next flush in the given number of milliseconds.
     */
    RequestBatcher.prototype.scheduleFlush = function(flushMS) {
        this.flushInterval = flushMS;
        if (!this.stopped) { // don't schedule anymore if batching has been stopped
            this.timeoutID = setTimeout(_.bind(this.flush, this), this.flushInterval);
        }
    };

    /**
     * Flush one batch to network. Depending on success/failure modes, it will either
     * remove the batch from the queue or leave it in for retry, and schedule the next
     * flush. In cases of most network or API failures, it will back off exponentially
     * when retrying.
     * @param {Object} [options]
     * @param {boolean} [options.sendBeacon] - whether to send batch with
     * navigator.sendBeacon (only useful for sending batches before page unloads, as
     * sendBeacon offers no callbacks or status indications)
     */
    RequestBatcher.prototype.flush = function(options) {
        try {

            if (this.requestInProgress) {
                logger.log('Flush: Request already in progress');
                return;
            }

            options = options || {};
            var timeoutMS = this.libConfig['batch_request_timeout_ms'];
            var startTime = new Date().getTime();
            var currentBatchSize = this.batchSize;
            var batch = this.queue.fillBatch(currentBatchSize);
            var dataForRequest = [];
            var transformedItems = {};
            _.each(batch, function(item) {
                var payload = item['payload'];
                if (this.beforeSendHook && !item.orphaned) {
                    payload = this.beforeSendHook(payload);
                }
                if (payload) {
                    dataForRequest.push(payload);
                }
                transformedItems[item['id']] = payload;
            }, this);
            if (dataForRequest.length < 1) {
                this.resetFlush();
                return; // nothing to do
            }

            this.requestInProgress = true;

            var batchSendCallback = _.bind(function(res) {
                this.requestInProgress = false;

                try {

                    // handle API response in a try-catch to make sure we can reset the
                    // flush operation if something goes wrong

                    var removeItemsFromQueue = false;
                    if (options.unloading) {
                        // update persisted data to include hook transformations
                        this.queue.updatePayloads(transformedItems);
                    } else if (
                        _.isObject(res) &&
                        res.error === 'timeout' &&
                        new Date().getTime() - startTime >= timeoutMS
                    ) {
                        logger.error('Network timeout; retrying');
                        this.flush();
                    } else if (
                        _.isObject(res) &&
                        res.xhr_req &&
                        (res.xhr_req['status'] >= 500 || res.xhr_req['status'] <= 0)
                    ) {
                        // network or API error, retry
                        var retryMS = this.flushInterval * 2;
                        var headers = res.xhr_req['responseHeaders'];
                        if (headers) {
                            var retryAfter = headers['Retry-After'];
                            if (retryAfter) {
                                retryMS = (parseInt(retryAfter, 10) * 1000) || retryMS;
                            }
                        }
                        retryMS = Math.min(MAX_RETRY_INTERVAL_MS, retryMS);
                        logger.error('Error; retry in ' + retryMS + ' ms');
                        this.scheduleFlush(retryMS);
                    } else if (_.isObject(res) && res.xhr_req && res.xhr_req['status'] === 413) {
                        // 413 Payload Too Large
                        if (batch.length > 1) {
                            var halvedBatchSize = Math.max(1, Math.floor(currentBatchSize / 2));
                            this.batchSize = Math.min(this.batchSize, halvedBatchSize, batch.length - 1);
                            logger.error('413 response; reducing batch size to ' + this.batchSize);
                            this.resetFlush();
                        } else {
                            logger.error('Single-event request too large; dropping', batch);
                            this.resetBatchSize();
                            removeItemsFromQueue = true;
                        }
                    } else {
                        // successful network request+response; remove each item in batch from queue
                        // (even if it was e.g. a 400, in which case retrying won't help)
                        removeItemsFromQueue = true;
                    }

                    if (removeItemsFromQueue) {
                        this.queue.removeItemsByID(
                            _.map(batch, function(item) { return item['id']; }),
                            _.bind(this.flush, this) // handle next batch if the queue isn't empty
                        );
                    }

                } catch(err) {
                    logger.error('Error handling API response', err);
                    this.resetFlush();
                }
            }, this);
            var requestOptions = {
                method: 'POST',
                verbose: true,
                ignore_json_errors: true, // eslint-disable-line camelcase
                timeout_ms: timeoutMS // eslint-disable-line camelcase
            };
            if (options.unloading) {
                requestOptions.transport = 'sendBeacon';
            }
            logger.log('MIXPANEL REQUEST:', dataForRequest);
            this.sendRequest(dataForRequest, requestOptions, batchSendCallback);

        } catch(err) {
            logger.error('Error flushing request queue', err);
            this.resetFlush();
        }
    };

    /**
     * A function used to track a Mixpanel event (e.g. MixpanelLib.track)
     * @callback trackFunction
     * @param {String} event_name The name of the event. This can be anything the user does - 'Button Click', 'Sign Up', 'Item Purchased', etc.
     * @param {Object} [properties] A set of properties to include with the event you're sending. These describe the user who did the event or details about the event itself.
     * @param {Function} [callback] If provided, the callback function will be called after tracking the event.
     */

    /** Public **/

    var GDPR_DEFAULT_PERSISTENCE_PREFIX = '__mp_opt_in_out_';

    /**
     * Opt the user in to data tracking and cookies/localstorage for the given token
     * @param {string} token - Mixpanel project tracking token
     * @param {Object} [options]
     * @param {trackFunction} [options.track] - function used for tracking a Mixpanel event to record the opt-in action
     * @param {string} [options.trackEventName] - event name to be used for tracking the opt-in action
     * @param {Object} [options.trackProperties] - set of properties to be tracked along with the opt-in action
     * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
     * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
     * @param {Number} [options.cookieExpiration] - number of days until the opt-in cookie expires
     * @param {string} [options.cookieDomain] - custom cookie domain
     * @param {boolean} [options.crossSiteCookie] - whether the opt-in cookie is set as cross-site-enabled
     * @param {boolean} [options.crossSubdomainCookie] - whether the opt-in cookie is set as cross-subdomain or not
     * @param {boolean} [options.secureCookie] - whether the opt-in cookie is set as secure or not
     */
    function optIn(token, options) {
        _optInOut(true, token, options);
    }

    /**
     * Opt the user out of data tracking and cookies/localstorage for the given token
     * @param {string} token - Mixpanel project tracking token
     * @param {Object} [options]
     * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
     * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
     * @param {Number} [options.cookieExpiration] - number of days until the opt-out cookie expires
     * @param {string} [options.cookieDomain] - custom cookie domain
     * @param {boolean} [options.crossSiteCookie] - whether the opt-in cookie is set as cross-site-enabled
     * @param {boolean} [options.crossSubdomainCookie] - whether the opt-out cookie is set as cross-subdomain or not
     * @param {boolean} [options.secureCookie] - whether the opt-out cookie is set as secure or not
     */
    function optOut(token, options) {
        _optInOut(false, token, options);
    }

    /**
     * Check whether the user has opted in to data tracking and cookies/localstorage for the given token
     * @param {string} token - Mixpanel project tracking token
     * @param {Object} [options]
     * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
     * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
     * @returns {boolean} whether the user has opted in to the given opt type
     */
    function hasOptedIn(token, options) {
        return _getStorageValue(token, options) === '1';
    }

    /**
     * Check whether the user has opted out of data tracking and cookies/localstorage for the given token
     * @param {string} token - Mixpanel project tracking token
     * @param {Object} [options]
     * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
     * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
     * @param {boolean} [options.ignoreDnt] - flag to ignore browser DNT settings and always return false
     * @returns {boolean} whether the user has opted out of the given opt type
     */
    function hasOptedOut(token, options) {
        if (_hasDoNotTrackFlagOn(options)) {
            console$1.warn('This browser has "Do Not Track" enabled. This will prevent the Mixpanel SDK from sending any data. To ignore the "Do Not Track" browser setting, initialize the Mixpanel instance with the config "ignore_dnt: true"');
            return true;
        }
        var optedOut = _getStorageValue(token, options) === '0';
        if (optedOut) {
            console$1.warn('You are opted out of Mixpanel tracking. This will prevent the Mixpanel SDK from sending any data.');
        }
        return optedOut;
    }

    /**
     * Wrap a MixpanelLib method with a check for whether the user is opted out of data tracking and cookies/localstorage for the given token
     * If the user has opted out, return early instead of executing the method.
     * If a callback argument was provided, execute it passing the 0 error code.
     * @param {function} method - wrapped method to be executed if the user has not opted out
     * @returns {*} the result of executing method OR undefined if the user has opted out
     */
    function addOptOutCheckMixpanelLib(method) {
        return _addOptOutCheck(method, function(name) {
            return this.get_config(name);
        });
    }

    /**
     * Wrap a MixpanelPeople method with a check for whether the user is opted out of data tracking and cookies/localstorage for the given token
     * If the user has opted out, return early instead of executing the method.
     * If a callback argument was provided, execute it passing the 0 error code.
     * @param {function} method - wrapped method to be executed if the user has not opted out
     * @returns {*} the result of executing method OR undefined if the user has opted out
     */
    function addOptOutCheckMixpanelPeople(method) {
        return _addOptOutCheck(method, function(name) {
            return this._get_config(name);
        });
    }

    /**
     * Wrap a MixpanelGroup method with a check for whether the user is opted out of data tracking and cookies/localstorage for the given token
     * If the user has opted out, return early instead of executing the method.
     * If a callback argument was provided, execute it passing the 0 error code.
     * @param {function} method - wrapped method to be executed if the user has not opted out
     * @returns {*} the result of executing method OR undefined if the user has opted out
     */
    function addOptOutCheckMixpanelGroup(method) {
        return _addOptOutCheck(method, function(name) {
            return this._get_config(name);
        });
    }

    /**
     * Clear the user's opt in/out status of data tracking and cookies/localstorage for the given token
     * @param {string} token - Mixpanel project tracking token
     * @param {Object} [options]
     * @param {string} [options.persistenceType] Persistence mechanism used - cookie or localStorage
     * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
     * @param {Number} [options.cookieExpiration] - number of days until the opt-in cookie expires
     * @param {string} [options.cookieDomain] - custom cookie domain
     * @param {boolean} [options.crossSiteCookie] - whether the opt-in cookie is set as cross-site-enabled
     * @param {boolean} [options.crossSubdomainCookie] - whether the opt-in cookie is set as cross-subdomain or not
     * @param {boolean} [options.secureCookie] - whether the opt-in cookie is set as secure or not
     */
    function clearOptInOut(token, options) {
        options = options || {};
        _getStorage(options).remove(
            _getStorageKey(token, options), !!options.crossSubdomainCookie, options.cookieDomain
        );
    }

    /** Private **/

    /**
     * Get storage util
     * @param {Object} [options]
     * @param {string} [options.persistenceType]
     * @returns {object} either _.cookie or _.localstorage
     */
    function _getStorage(options) {
        options = options || {};
        return options.persistenceType === 'localStorage' ? _.localStorage : _.cookie;
    }

    /**
     * Get the name of the cookie that is used for the given opt type (tracking, cookie, etc.)
     * @param {string} token - Mixpanel project tracking token
     * @param {Object} [options]
     * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
     * @returns {string} the name of the cookie for the given opt type
     */
    function _getStorageKey(token, options) {
        options = options || {};
        return (options.persistencePrefix || GDPR_DEFAULT_PERSISTENCE_PREFIX) + token;
    }

    /**
     * Get the value of the cookie that is used for the given opt type (tracking, cookie, etc.)
     * @param {string} token - Mixpanel project tracking token
     * @param {Object} [options]
     * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
     * @returns {string} the value of the cookie for the given opt type
     */
    function _getStorageValue(token, options) {
        return _getStorage(options).get(_getStorageKey(token, options));
    }

    /**
     * Check whether the user has set the DNT/doNotTrack setting to true in their browser
     * @param {Object} [options]
     * @param {string} [options.window] - alternate window object to check; used to force various DNT settings in browser tests
     * @param {boolean} [options.ignoreDnt] - flag to ignore browser DNT settings and always return false
     * @returns {boolean} whether the DNT setting is true
     */
    function _hasDoNotTrackFlagOn(options) {
        if (options && options.ignoreDnt) {
            return false;
        }
        var win = (options && options.window) || window$1;
        var nav = win['navigator'] || {};
        var hasDntOn = false;

        _.each([
            nav['doNotTrack'], // standard
            nav['msDoNotTrack'],
            win['doNotTrack']
        ], function(dntValue) {
            if (_.includes([true, 1, '1', 'yes'], dntValue)) {
                hasDntOn = true;
            }
        });

        return hasDntOn;
    }

    /**
     * Set cookie/localstorage for the user indicating that they are opted in or out for the given opt type
     * @param {boolean} optValue - whether to opt the user in or out for the given opt type
     * @param {string} token - Mixpanel project tracking token
     * @param {Object} [options]
     * @param {trackFunction} [options.track] - function used for tracking a Mixpanel event to record the opt-in action
     * @param {string} [options.trackEventName] - event name to be used for tracking the opt-in action
     * @param {Object} [options.trackProperties] - set of properties to be tracked along with the opt-in action
     * @param {string} [options.persistencePrefix=__mp_opt_in_out] - custom prefix to be used in the cookie/localstorage name
     * @param {Number} [options.cookieExpiration] - number of days until the opt-in cookie expires
     * @param {string} [options.cookieDomain] - custom cookie domain
     * @param {boolean} [options.crossSiteCookie] - whether the opt-in cookie is set as cross-site-enabled
     * @param {boolean} [options.crossSubdomainCookie] - whether the opt-in cookie is set as cross-subdomain or not
     * @param {boolean} [options.secureCookie] - whether the opt-in cookie is set as secure or not
     */
    function _optInOut(optValue, token, options) {
        if (!_.isString(token) || !token.length) {
            console$1.error('gdpr.' + (optValue ? 'optIn' : 'optOut') + ' called with an invalid token');
            return;
        }

        options = options || {};

        _getStorage(options).set(
            _getStorageKey(token, options),
            optValue ? 1 : 0,
            _.isNumber(options.cookieExpiration) ? options.cookieExpiration : null,
            !!options.crossSubdomainCookie,
            !!options.secureCookie,
            !!options.crossSiteCookie,
            options.cookieDomain
        );

        if (options.track && optValue) { // only track event if opting in (optValue=true)
            options.track(options.trackEventName || '$opt_in', options.trackProperties, {
                'send_immediately': true
            });
        }
    }

    /**
     * Wrap a method with a check for whether the user is opted out of data tracking and cookies/localstorage for the given token
     * If the user has opted out, return early instead of executing the method.
     * If a callback argument was provided, execute it passing the 0 error code.
     * @param {function} method - wrapped method to be executed if the user has not opted out
     * @param {function} getConfigValue - getter function for the Mixpanel API token and other options to be used with opt-out check
     * @returns {*} the result of executing method OR undefined if the user has opted out
     */
    function _addOptOutCheck(method, getConfigValue) {
        return function() {
            var optedOut = false;

            try {
                var token = getConfigValue.call(this, 'token');
                var ignoreDnt = getConfigValue.call(this, 'ignore_dnt');
                var persistenceType = getConfigValue.call(this, 'opt_out_tracking_persistence_type');
                var persistencePrefix = getConfigValue.call(this, 'opt_out_tracking_cookie_prefix');
                var win = getConfigValue.call(this, 'window'); // used to override window during browser tests

                if (token) { // if there was an issue getting the token, continue method execution as normal
                    optedOut = hasOptedOut(token, {
                        ignoreDnt: ignoreDnt,
                        persistenceType: persistenceType,
                        persistencePrefix: persistencePrefix,
                        window: win
                    });
                }
            } catch(err) {
                console$1.error('Unexpected error when checking tracking opt-out status: ' + err);
            }

            if (!optedOut) {
                return method.apply(this, arguments);
            }

            var callback = arguments[arguments.length - 1];
            if (typeof(callback) === 'function') {
                callback(0);
            }

            return;
        };
    }

    /** @const */ var SET_ACTION      = '$set';
    /** @const */ var SET_ONCE_ACTION = '$set_once';
    /** @const */ var UNSET_ACTION    = '$unset';
    /** @const */ var ADD_ACTION      = '$add';
    /** @const */ var APPEND_ACTION   = '$append';
    /** @const */ var UNION_ACTION    = '$union';
    /** @const */ var REMOVE_ACTION   = '$remove';
    /** @const */ var DELETE_ACTION   = '$delete';

    // Common internal methods for mixpanel.people and mixpanel.group APIs.
    // These methods shouldn't involve network I/O.
    var apiActions = {
        set_action: function(prop, to) {
            var data = {};
            var $set = {};
            if (_.isObject(prop)) {
                _.each(prop, function(v, k) {
                    if (!this._is_reserved_property(k)) {
                        $set[k] = v;
                    }
                }, this);
            } else {
                $set[prop] = to;
            }

            data[SET_ACTION] = $set;
            return data;
        },

        unset_action: function(prop) {
            var data = {};
            var $unset = [];
            if (!_.isArray(prop)) {
                prop = [prop];
            }

            _.each(prop, function(k) {
                if (!this._is_reserved_property(k)) {
                    $unset.push(k);
                }
            }, this);

            data[UNSET_ACTION] = $unset;
            return data;
        },

        set_once_action: function(prop, to) {
            var data = {};
            var $set_once = {};
            if (_.isObject(prop)) {
                _.each(prop, function(v, k) {
                    if (!this._is_reserved_property(k)) {
                        $set_once[k] = v;
                    }
                }, this);
            } else {
                $set_once[prop] = to;
            }
            data[SET_ONCE_ACTION] = $set_once;
            return data;
        },

        union_action: function(list_name, values) {
            var data = {};
            var $union = {};
            if (_.isObject(list_name)) {
                _.each(list_name, function(v, k) {
                    if (!this._is_reserved_property(k)) {
                        $union[k] = _.isArray(v) ? v : [v];
                    }
                }, this);
            } else {
                $union[list_name] = _.isArray(values) ? values : [values];
            }
            data[UNION_ACTION] = $union;
            return data;
        },

        append_action: function(list_name, value) {
            var data = {};
            var $append = {};
            if (_.isObject(list_name)) {
                _.each(list_name, function(v, k) {
                    if (!this._is_reserved_property(k)) {
                        $append[k] = v;
                    }
                }, this);
            } else {
                $append[list_name] = value;
            }
            data[APPEND_ACTION] = $append;
            return data;
        },

        remove_action: function(list_name, value) {
            var data = {};
            var $remove = {};
            if (_.isObject(list_name)) {
                _.each(list_name, function(v, k) {
                    if (!this._is_reserved_property(k)) {
                        $remove[k] = v;
                    }
                }, this);
            } else {
                $remove[list_name] = value;
            }
            data[REMOVE_ACTION] = $remove;
            return data;
        },

        delete_action: function() {
            var data = {};
            data[DELETE_ACTION] = '';
            return data;
        }
    };

    /**
     * Mixpanel Group Object
     * @constructor
     */
    var MixpanelGroup = function() {};

    _.extend(MixpanelGroup.prototype, apiActions);

    MixpanelGroup.prototype._init = function(mixpanel_instance, group_key, group_id) {
        this._mixpanel = mixpanel_instance;
        this._group_key = group_key;
        this._group_id = group_id;
    };

    /**
     * Set properties on a group.
     *
     * ### Usage:
     *
     *     mixpanel.get_group('company', 'mixpanel').set('Location', '405 Howard');
     *
     *     // or set multiple properties at once
     *     mixpanel.get_group('company', 'mixpanel').set({
     *          'Location': '405 Howard',
     *          'Founded' : 2009,
     *     });
     *     // properties can be strings, integers, dates, or lists
     *
     * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
     * @param {*} [to] A value to set on the given property name
     * @param {Function} [callback] If provided, the callback will be called after the tracking event
     */
    MixpanelGroup.prototype.set = addOptOutCheckMixpanelGroup(function(prop, to, callback) {
        var data = this.set_action(prop, to);
        if (_.isObject(prop)) {
            callback = to;
        }
        return this._send_request(data, callback);
    });

    /**
     * Set properties on a group, only if they do not yet exist.
     * This will not overwrite previous group property values, unlike
     * group.set().
     *
     * ### Usage:
     *
     *     mixpanel.get_group('company', 'mixpanel').set_once('Location', '405 Howard');
     *
     *     // or set multiple properties at once
     *     mixpanel.get_group('company', 'mixpanel').set_once({
     *          'Location': '405 Howard',
     *          'Founded' : 2009,
     *     });
     *     // properties can be strings, integers, lists or dates
     *
     * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
     * @param {*} [to] A value to set on the given property name
     * @param {Function} [callback] If provided, the callback will be called after the tracking event
     */
    MixpanelGroup.prototype.set_once = addOptOutCheckMixpanelGroup(function(prop, to, callback) {
        var data = this.set_once_action(prop, to);
        if (_.isObject(prop)) {
            callback = to;
        }
        return this._send_request(data, callback);
    });

    /**
     * Unset properties on a group permanently.
     *
     * ### Usage:
     *
     *     mixpanel.get_group('company', 'mixpanel').unset('Founded');
     *
     * @param {String} prop The name of the property.
     * @param {Function} [callback] If provided, the callback will be called after the tracking event
     */
    MixpanelGroup.prototype.unset = addOptOutCheckMixpanelGroup(function(prop, callback) {
        var data = this.unset_action(prop);
        return this._send_request(data, callback);
    });

    /**
     * Merge a given list with a list-valued group property, excluding duplicate values.
     *
     * ### Usage:
     *
     *     // merge a value to a list, creating it if needed
     *     mixpanel.get_group('company', 'mixpanel').union('Location', ['San Francisco', 'London']);
     *
     * @param {String} list_name Name of the property.
     * @param {Array} values Values to merge with the given property
     * @param {Function} [callback] If provided, the callback will be called after the tracking event
     */
    MixpanelGroup.prototype.union = addOptOutCheckMixpanelGroup(function(list_name, values, callback) {
        if (_.isObject(list_name)) {
            callback = values;
        }
        var data = this.union_action(list_name, values);
        return this._send_request(data, callback);
    });

    /**
     * Permanently delete a group.
     *
     * ### Usage:
     *     mixpanel.get_group('company', 'mixpanel').delete();
     */
    MixpanelGroup.prototype['delete'] = addOptOutCheckMixpanelGroup(function(callback) {
        var data = this.delete_action();
        return this._send_request(data, callback);
    });

    /**
     * Remove a property from a group. The value will be ignored if doesn't exist.
     *
     * ### Usage:
     *
     *     mixpanel.get_group('company', 'mixpanel').remove('Location', 'London');
     *
     * @param {String} list_name Name of the property.
     * @param {Object} value Value to remove from the given group property
     * @param {Function} [callback] If provided, the callback will be called after the tracking event
     */
    MixpanelGroup.prototype.remove = addOptOutCheckMixpanelGroup(function(list_name, value, callback) {
        var data = this.remove_action(list_name, value);
        return this._send_request(data, callback);
    });

    MixpanelGroup.prototype._send_request = function(data, callback) {
        data['$group_key'] = this._group_key;
        data['$group_id'] = this._group_id;
        data['$token'] = this._get_config('token');

        var date_encoded_data = _.encodeDates(data);
        return this._mixpanel._track_or_batch({
            type: 'groups',
            data: date_encoded_data,
            endpoint: this._get_config('api_host') + '/groups/',
            batcher: this._mixpanel.request_batchers.groups
        }, callback);
    };

    MixpanelGroup.prototype._is_reserved_property = function(prop) {
        return prop === '$group_key' || prop === '$group_id';
    };

    MixpanelGroup.prototype._get_config = function(conf) {
        return this._mixpanel.get_config(conf);
    };

    MixpanelGroup.prototype.toString = function() {
        return this._mixpanel.toString() + '.group.' + this._group_key + '.' + this._group_id;
    };

    // MixpanelGroup Exports
    MixpanelGroup.prototype['remove']   = MixpanelGroup.prototype.remove;
    MixpanelGroup.prototype['set']      = MixpanelGroup.prototype.set;
    MixpanelGroup.prototype['set_once'] = MixpanelGroup.prototype.set_once;
    MixpanelGroup.prototype['union']    = MixpanelGroup.prototype.union;
    MixpanelGroup.prototype['unset']    = MixpanelGroup.prototype.unset;
    MixpanelGroup.prototype['toString'] = MixpanelGroup.prototype.toString;

    /*
     * Constants
     */
    /** @const */ var SET_QUEUE_KEY          = '__mps';
    /** @const */ var SET_ONCE_QUEUE_KEY     = '__mpso';
    /** @const */ var UNSET_QUEUE_KEY        = '__mpus';
    /** @const */ var ADD_QUEUE_KEY          = '__mpa';
    /** @const */ var APPEND_QUEUE_KEY       = '__mpap';
    /** @const */ var REMOVE_QUEUE_KEY       = '__mpr';
    /** @const */ var UNION_QUEUE_KEY        = '__mpu';
    // This key is deprecated, but we want to check for it to see whether aliasing is allowed.
    /** @const */ var PEOPLE_DISTINCT_ID_KEY = '$people_distinct_id';
    /** @const */ var ALIAS_ID_KEY           = '__alias';
    /** @const */ var CAMPAIGN_IDS_KEY       = '__cmpns';
    /** @const */ var EVENT_TIMERS_KEY       = '__timers';
    /** @const */ var RESERVED_PROPERTIES = [
        SET_QUEUE_KEY,
        SET_ONCE_QUEUE_KEY,
        UNSET_QUEUE_KEY,
        ADD_QUEUE_KEY,
        APPEND_QUEUE_KEY,
        REMOVE_QUEUE_KEY,
        UNION_QUEUE_KEY,
        PEOPLE_DISTINCT_ID_KEY,
        ALIAS_ID_KEY,
        CAMPAIGN_IDS_KEY,
        EVENT_TIMERS_KEY
    ];

    /**
     * Mixpanel Persistence Object
     * @constructor
     */
    var MixpanelPersistence = function(config) {
        this['props'] = {};
        this.campaign_params_saved = false;

        if (config['persistence_name']) {
            this.name = 'mp_' + config['persistence_name'];
        } else {
            this.name = 'mp_' + config['token'] + '_mixpanel';
        }

        var storage_type = config['persistence'];
        if (storage_type !== 'cookie' && storage_type !== 'localStorage') {
            console$1.critical('Unknown persistence type ' + storage_type + '; falling back to cookie');
            storage_type = config['persistence'] = 'cookie';
        }

        if (storage_type === 'localStorage' && _.localStorage.is_supported()) {
            this.storage = _.localStorage;
        } else {
            this.storage = _.cookie;
        }

        this.load();
        this.update_config(config);
        this.upgrade(config);
        this.save();
    };

    MixpanelPersistence.prototype.properties = function() {
        var p = {};
        // Filter out reserved properties
        _.each(this['props'], function(v, k) {
            if (!_.include(RESERVED_PROPERTIES, k)) {
                p[k] = v;
            }
        });
        return p;
    };

    MixpanelPersistence.prototype.load = function() {
        if (this.disabled) { return; }

        var entry = this.storage.parse(this.name);

        if (entry) {
            this['props'] = _.extend({}, entry);
        }
    };

    MixpanelPersistence.prototype.upgrade = function(config) {
        var upgrade_from_old_lib = config['upgrade'],
            old_cookie_name,
            old_cookie;

        if (upgrade_from_old_lib) {
            old_cookie_name = 'mp_super_properties';
            // Case where they had a custom cookie name before.
            if (typeof(upgrade_from_old_lib) === 'string') {
                old_cookie_name = upgrade_from_old_lib;
            }

            old_cookie = this.storage.parse(old_cookie_name);

            // remove the cookie
            this.storage.remove(old_cookie_name);
            this.storage.remove(old_cookie_name, true);

            if (old_cookie) {
                this['props'] = _.extend(
                    this['props'],
                    old_cookie['all'],
                    old_cookie['events']
                );
            }
        }

        if (!config['cookie_name'] && config['name'] !== 'mixpanel') {
            // special case to handle people with cookies of the form
            // mp_TOKEN_INSTANCENAME from the first release of this library
            old_cookie_name = 'mp_' + config['token'] + '_' + config['name'];
            old_cookie = this.storage.parse(old_cookie_name);

            if (old_cookie) {
                this.storage.remove(old_cookie_name);
                this.storage.remove(old_cookie_name, true);

                // Save the prop values that were in the cookie from before -
                // this should only happen once as we delete the old one.
                this.register_once(old_cookie);
            }
        }

        if (this.storage === _.localStorage) {
            old_cookie = _.cookie.parse(this.name);

            _.cookie.remove(this.name);
            _.cookie.remove(this.name, true);

            if (old_cookie) {
                this.register_once(old_cookie);
            }
        }
    };

    MixpanelPersistence.prototype.save = function() {
        if (this.disabled) { return; }
        this._expire_notification_campaigns();
        this.storage.set(
            this.name,
            _.JSONEncode(this['props']),
            this.expire_days,
            this.cross_subdomain,
            this.secure,
            this.cross_site,
            this.cookie_domain
        );
    };

    MixpanelPersistence.prototype.remove = function() {
        // remove both domain and subdomain cookies
        this.storage.remove(this.name, false, this.cookie_domain);
        this.storage.remove(this.name, true, this.cookie_domain);
    };

    // removes the storage entry and deletes all loaded data
    // forced name for tests
    MixpanelPersistence.prototype.clear = function() {
        this.remove();
        this['props'] = {};
    };

    /**
    * @param {Object} props
    * @param {*=} default_value
    * @param {number=} days
    */
    MixpanelPersistence.prototype.register_once = function(props, default_value, days) {
        if (_.isObject(props)) {
            if (typeof(default_value) === 'undefined') { default_value = 'None'; }
            this.expire_days = (typeof(days) === 'undefined') ? this.default_expiry : days;

            _.each(props, function(val, prop) {
                if (!this['props'].hasOwnProperty(prop) || this['props'][prop] === default_value) {
                    this['props'][prop] = val;
                }
            }, this);

            this.save();

            return true;
        }
        return false;
    };

    /**
    * @param {Object} props
    * @param {number=} days
    */
    MixpanelPersistence.prototype.register = function(props, days) {
        if (_.isObject(props)) {
            this.expire_days = (typeof(days) === 'undefined') ? this.default_expiry : days;

            _.extend(this['props'], props);

            this.save();

            return true;
        }
        return false;
    };

    MixpanelPersistence.prototype.unregister = function(prop) {
        if (prop in this['props']) {
            delete this['props'][prop];
            this.save();
        }
    };

    MixpanelPersistence.prototype._expire_notification_campaigns = _.safewrap(function() {
        var campaigns_shown = this['props'][CAMPAIGN_IDS_KEY],
            EXPIRY_TIME = Config.DEBUG ? 60 * 1000 : 60 * 60 * 1000; // 1 minute (Config.DEBUG) / 1 hour (PDXN)
        if (!campaigns_shown) {
            return;
        }
        for (var campaign_id in campaigns_shown) {
            if (1 * new Date() - campaigns_shown[campaign_id] > EXPIRY_TIME) {
                delete campaigns_shown[campaign_id];
            }
        }
        if (_.isEmptyObject(campaigns_shown)) {
            delete this['props'][CAMPAIGN_IDS_KEY];
        }
    });

    MixpanelPersistence.prototype.update_campaign_params = function() {
        if (!this.campaign_params_saved) {
            this.register_once(_.info.campaignParams());
            this.campaign_params_saved = true;
        }
    };

    MixpanelPersistence.prototype.update_search_keyword = function(referrer) {
        this.register(_.info.searchInfo(referrer));
    };

    // EXPORTED METHOD, we test this directly.
    MixpanelPersistence.prototype.update_referrer_info = function(referrer) {
        // If referrer doesn't exist, we want to note the fact that it was type-in traffic.
        this.register_once({
            '$initial_referrer': referrer || '$direct',
            '$initial_referring_domain': _.info.referringDomain(referrer) || '$direct'
        }, '');
    };

    MixpanelPersistence.prototype.get_referrer_info = function() {
        return _.strip_empty_properties({
            '$initial_referrer': this['props']['$initial_referrer'],
            '$initial_referring_domain': this['props']['$initial_referring_domain']
        });
    };

    // safely fills the passed in object with stored properties,
    // does not override any properties defined in both
    // returns the passed in object
    MixpanelPersistence.prototype.safe_merge = function(props) {
        _.each(this['props'], function(val, prop) {
            if (!(prop in props)) {
                props[prop] = val;
            }
        });

        return props;
    };

    MixpanelPersistence.prototype.update_config = function(config) {
        this.default_expiry = this.expire_days = config['cookie_expiration'];
        this.set_disabled(config['disable_persistence']);
        this.set_cookie_domain(config['cookie_domain']);
        this.set_cross_site(config['cross_site_cookie']);
        this.set_cross_subdomain(config['cross_subdomain_cookie']);
        this.set_secure(config['secure_cookie']);
    };

    MixpanelPersistence.prototype.set_disabled = function(disabled) {
        this.disabled = disabled;
        if (this.disabled) {
            this.remove();
        } else {
            this.save();
        }
    };

    MixpanelPersistence.prototype.set_cookie_domain = function(cookie_domain) {
        if (cookie_domain !== this.cookie_domain) {
            this.remove();
            this.cookie_domain = cookie_domain;
            this.save();
        }
    };

    MixpanelPersistence.prototype.set_cross_site = function(cross_site) {
        if (cross_site !== this.cross_site) {
            this.cross_site = cross_site;
            this.remove();
            this.save();
        }
    };

    MixpanelPersistence.prototype.set_cross_subdomain = function(cross_subdomain) {
        if (cross_subdomain !== this.cross_subdomain) {
            this.cross_subdomain = cross_subdomain;
            this.remove();
            this.save();
        }
    };

    MixpanelPersistence.prototype.get_cross_subdomain = function() {
        return this.cross_subdomain;
    };

    MixpanelPersistence.prototype.set_secure = function(secure) {
        if (secure !== this.secure) {
            this.secure = secure ? true : false;
            this.remove();
            this.save();
        }
    };

    MixpanelPersistence.prototype._add_to_people_queue = function(queue, data) {
        var q_key = this._get_queue_key(queue),
            q_data = data[queue],
            set_q = this._get_or_create_queue(SET_ACTION),
            set_once_q = this._get_or_create_queue(SET_ONCE_ACTION),
            unset_q = this._get_or_create_queue(UNSET_ACTION),
            add_q = this._get_or_create_queue(ADD_ACTION),
            union_q = this._get_or_create_queue(UNION_ACTION),
            remove_q = this._get_or_create_queue(REMOVE_ACTION, []),
            append_q = this._get_or_create_queue(APPEND_ACTION, []);

        if (q_key === SET_QUEUE_KEY) {
            // Update the set queue - we can override any existing values
            _.extend(set_q, q_data);
            // if there was a pending increment, override it
            // with the set.
            this._pop_from_people_queue(ADD_ACTION, q_data);
            // if there was a pending union, override it
            // with the set.
            this._pop_from_people_queue(UNION_ACTION, q_data);
            this._pop_from_people_queue(UNSET_ACTION, q_data);
        } else if (q_key === SET_ONCE_QUEUE_KEY) {
            // only queue the data if there is not already a set_once call for it.
            _.each(q_data, function(v, k) {
                if (!(k in set_once_q)) {
                    set_once_q[k] = v;
                }
            });
            this._pop_from_people_queue(UNSET_ACTION, q_data);
        } else if (q_key === UNSET_QUEUE_KEY) {
            _.each(q_data, function(prop) {

                // undo previously-queued actions on this key
                _.each([set_q, set_once_q, add_q, union_q], function(enqueued_obj) {
                    if (prop in enqueued_obj) {
                        delete enqueued_obj[prop];
                    }
                });
                _.each(append_q, function(append_obj) {
                    if (prop in append_obj) {
                        delete append_obj[prop];
                    }
                });

                unset_q[prop] = true;

            });
        } else if (q_key === ADD_QUEUE_KEY) {
            _.each(q_data, function(v, k) {
                // If it exists in the set queue, increment
                // the value
                if (k in set_q) {
                    set_q[k] += v;
                } else {
                    // If it doesn't exist, update the add
                    // queue
                    if (!(k in add_q)) {
                        add_q[k] = 0;
                    }
                    add_q[k] += v;
                }
            }, this);
            this._pop_from_people_queue(UNSET_ACTION, q_data);
        } else if (q_key === UNION_QUEUE_KEY) {
            _.each(q_data, function(v, k) {
                if (_.isArray(v)) {
                    if (!(k in union_q)) {
                        union_q[k] = [];
                    }
                    // We may send duplicates, the server will dedup them.
                    union_q[k] = union_q[k].concat(v);
                }
            });
            this._pop_from_people_queue(UNSET_ACTION, q_data);
        } else if (q_key === REMOVE_QUEUE_KEY) {
            remove_q.push(q_data);
            this._pop_from_people_queue(APPEND_ACTION, q_data);
        } else if (q_key === APPEND_QUEUE_KEY) {
            append_q.push(q_data);
            this._pop_from_people_queue(UNSET_ACTION, q_data);
        }

        console$1.log('MIXPANEL PEOPLE REQUEST (QUEUED, PENDING IDENTIFY):');
        console$1.log(data);

        this.save();
    };

    MixpanelPersistence.prototype._pop_from_people_queue = function(queue, data) {
        var q = this._get_queue(queue);
        if (!_.isUndefined(q)) {
            _.each(data, function(v, k) {
                if (queue === APPEND_ACTION || queue === REMOVE_ACTION) {
                    // list actions: only remove if both k+v match
                    // e.g. remove should not override append in a case like
                    // append({foo: 'bar'}); remove({foo: 'qux'})
                    _.each(q, function(queued_action) {
                        if (queued_action[k] === v) {
                            delete queued_action[k];
                        }
                    });
                } else {
                    delete q[k];
                }
            }, this);

            this.save();
        }
    };

    MixpanelPersistence.prototype._get_queue_key = function(queue) {
        if (queue === SET_ACTION) {
            return SET_QUEUE_KEY;
        } else if (queue === SET_ONCE_ACTION) {
            return SET_ONCE_QUEUE_KEY;
        } else if (queue === UNSET_ACTION) {
            return UNSET_QUEUE_KEY;
        } else if (queue === ADD_ACTION) {
            return ADD_QUEUE_KEY;
        } else if (queue === APPEND_ACTION) {
            return APPEND_QUEUE_KEY;
        } else if (queue === REMOVE_ACTION) {
            return REMOVE_QUEUE_KEY;
        } else if (queue === UNION_ACTION) {
            return UNION_QUEUE_KEY;
        } else {
            console$1.error('Invalid queue:', queue);
        }
    };

    MixpanelPersistence.prototype._get_queue = function(queue) {
        return this['props'][this._get_queue_key(queue)];
    };
    MixpanelPersistence.prototype._get_or_create_queue = function(queue, default_val) {
        var key = this._get_queue_key(queue);
        default_val = _.isUndefined(default_val) ? {} : default_val;

        return this['props'][key] || (this['props'][key] = default_val);
    };

    MixpanelPersistence.prototype.set_event_timer = function(event_name, timestamp) {
        var timers = this['props'][EVENT_TIMERS_KEY] || {};
        timers[event_name] = timestamp;
        this['props'][EVENT_TIMERS_KEY] = timers;
        this.save();
    };

    MixpanelPersistence.prototype.remove_event_timer = function(event_name) {
        var timers = this['props'][EVENT_TIMERS_KEY] || {};
        var timestamp = timers[event_name];
        if (!_.isUndefined(timestamp)) {
            delete this['props'][EVENT_TIMERS_KEY][event_name];
            this.save();
        }
        return timestamp;
    };

    /*
     * This file is a js implementation for a subset in eval_node.c
     */

    /*
     * Constants
     */
    // Metadata keys
    /** @const */   var OPERATOR_KEY                  = 'operator';
    /** @const */   var PROPERTY_KEY                  = 'property';
    /** @const */   var WINDOW_KEY                    = 'window';
    /** @const */   var UNIT_KEY                      = 'unit';
    /** @const */   var VALUE_KEY                     = 'value';
    /** @const */   var HOUR_KEY                      = 'hour';
    /** @const */   var DAY_KEY                       = 'day';
    /** @const */   var WEEK_KEY                      = 'week';
    /** @const */   var MONTH_KEY                     = 'month';

    // Operands
    /** @const */   var EVENT_PROPERTY         = 'event';
    /** @const */   var LITERAL_PROPERTY       = 'literal';

    // Binary Operators
    /** @const */   var AND_OPERATOR           = 'and';
    /** @const */   var OR_OPERATOR            = 'or';
    /** @const */   var IN_OPERATOR            = 'in';
    /** @const */   var NOT_IN_OPERATOR        = 'not in';
    /** @const */   var PLUS_OPERATOR          = '+';
    /** @const */   var MINUS_OPERATOR         = '-';
    /** @const */   var MUL_OPERATOR           = '*';
    /** @const */   var DIV_OPERATOR           = '/';
    /** @const */   var MOD_OPERATOR           = '%';
    /** @const */   var EQUALS_OPERATOR        = '==';
    /** @const */   var NOT_EQUALS_OPERATOR    = '!=';
    /** @const */   var GREATER_OPERATOR       = '>';
    /** @const */   var LESS_OPERATOR          = '<';
    /** @const */   var GREATER_EQUAL_OPERATOR = '>=';
    /** @const */   var LESS_EQUAL_OPERATOR    = '<=';

    // Typecast Operators
    /** @const */   var BOOLEAN_OPERATOR       = 'boolean';
    /** @const */   var DATETIME_OPERATOR      = 'datetime';
    /** @const */   var LIST_OPERATOR          = 'list';
    /** @const */   var NUMBER_OPERATOR        = 'number';
    /** @const */   var STRING_OPERATOR        = 'string';

    // Unary Operators
    /** @const */   var NOT_OPERATOR           = 'not';
    /** @const */   var DEFINED_OPERATOR       = 'defined';
    /** @const */   var NOT_DEFINED_OPERATOR   = 'not defined';

    // Special literals
    /** @const */   var NOW_LITERAL            = 'now';

    // Type cast functions
    function toNumber(value) {
        if (value === null) {
            return null;
        }

        switch (typeof(value)) {
            case 'object':
                if (_.isDate(value) && value.getTime() >= 0) {
                    return value.getTime();
                }
                return null;
            case 'boolean':
                return Number(value);
            case 'number':
                return value;
            case 'string':
                value = Number(value);
                if (!isNaN(value)) {
                    return value;
                }
                return 0;
        }
        return null;
    }

    function evaluateNumber(op, properties) {
        if (!op['operator'] || op['operator'] !== NUMBER_OPERATOR || !op['children'] || op['children'].length !== 1) {
            throw ('Invalid cast operator: number ' + op);
        }

        return toNumber(evaluateSelector(op['children'][0], properties));
    }

    function toBoolean(value) {
        if (value === null) {
            return false;
        }

        switch (typeof value) {
            case 'boolean':
                return value;
            case 'number':
                return value !== 0.0;
            case 'string':
                return value.length > 0;
            case 'object':
                if (_.isArray(value) && value.length > 0) {
                    return true;
                }
                if (_.isDate(value) && value.getTime() > 0) {
                    return true;
                }
                if (_.isObject(value) && !_.isEmptyObject(value)) {
                    return true;
                }
                return false;
        }
        return false;
    }

    function evaluateBoolean(op, properties) {
        if (!op['operator'] || op['operator'] !== BOOLEAN_OPERATOR || !op['children'] || op['children'].length !== 1) {
            throw ('Invalid cast operator: boolean ' + op);
        }

        return toBoolean(evaluateSelector(op['children'][0], properties));
    }

    function evaluateDateTime(op, properties) {
        if (!op['operator'] || op['operator'] !== DATETIME_OPERATOR || !op['children'] || op['children'].length !== 1) {
            throw ('Invalid cast operator: datetime ' + op);
        }

        var v = evaluateSelector(op['children'][0], properties);
        if (v === null) {
            return null;
        }

        switch (typeof(v)) {
            case 'number':
            case 'string':
                var d = new Date(v);
                if (isNaN(d.getTime())) {
                    return null;
                }
                return d;
            case 'object':
                if (_.isDate(v)) {
                    return v;
                }
        }

        return null;
    }

    function evaluateList(op, properties) {
        if (!op['operator'] || op['operator'] !== LIST_OPERATOR || !op['children'] || op['children'].length !== 1) {
            throw ('Invalid cast operator: list ' + op);
        }

        var v = evaluateSelector(op['children'][0], properties);
        if (v === null) {
            return null;
        }

        if (_.isArray(v)) {
            return v;
        }

        return null;
    }

    function evaluateString(op, properties) {
        if (!op['operator'] || op['operator'] !== STRING_OPERATOR || !op['children'] || op['children'].length !== 1) {
            throw ('Invalid cast operator: string ' + op);
        }

        var v = evaluateSelector(op['children'][0], properties);
        switch (typeof(v)) {
            case 'object':
                if (_.isDate(v)) {
                    return v.toJSON();
                }
                return JSON.stringify(v);
        }
        return String(v);
    }

    // Operators
    function evaluateAnd(op, properties) {
        if (!op['operator'] || op['operator'] !== AND_OPERATOR || !op['children'] || op['children'].length !== 2) {
            throw ('Invalid operator: AND ' + op);
        }

        return toBoolean(evaluateSelector(op['children'][0], properties)) && toBoolean(evaluateSelector(op['children'][1], properties));
    }

    function evaluateOr(op, properties) {
        if (!op['operator'] || op['operator'] !== OR_OPERATOR || !op['children'] || op['children'].length !== 2) {
            throw ('Invalid operator: OR ' + op);
        }

        return toBoolean(evaluateSelector(op['children'][0], properties)) || toBoolean(evaluateSelector(op['children'][1], properties));
    }

    function evaluateIn(op, properties) {
        if (!op['operator'] || [IN_OPERATOR, NOT_IN_OPERATOR].indexOf(op['operator']) === -1 || !op['children'] || op['children'].length !== 2) {
            throw ('Invalid operator: IN/NOT IN ' + op);
        }
        var leftValue = evaluateSelector(op['children'][0], properties);
        var rightValue = evaluateSelector(op['children'][1], properties);

        if (!_.isArray(rightValue) && !_.isString(rightValue)) {
            throw ('Invalid operand for operator IN: invalid type' + rightValue);
        }

        var v = rightValue.indexOf(leftValue) > -1;
        if (op['operator'] === NOT_IN_OPERATOR) {
            return !v;
        }
        return v;
    }

    function evaluatePlus(op, properties) {
        if (!op['operator'] || op['operator'] !== PLUS_OPERATOR || !op['children'] || op['children'].length < 2) {
            throw ('Invalid operator: PLUS ' + op);
        }
        var l = evaluateSelector(op['children'][0], properties);
        var r = evaluateSelector(op['children'][1], properties);

        if (typeof l === 'number' && typeof r === 'number') {
            return l + r;
        }
        if (typeof l === 'string' && typeof r === 'string') {
            return l + r;
        }
        return null;
    }

    function evaluateArithmetic(op, properties) {
        if (!op['operator'] || [MINUS_OPERATOR, MUL_OPERATOR, DIV_OPERATOR, MOD_OPERATOR].indexOf(op['operator']) === -1 ||
            !op['children'] || op['children'].length < 2) {
            throw ('Invalid arithmetic operator ' + op);
        }

        var l = evaluateSelector(op['children'][0], properties);
        var r = evaluateSelector(op['children'][1], properties);

        if (typeof l === 'number' && typeof r === 'number') {
            switch (op['operator']) {
                case MINUS_OPERATOR:
                    return l - r;
                case MUL_OPERATOR:
                    return l * r;
                case DIV_OPERATOR:
                    if (r !== 0) {
                        return l / r;
                    }
                    return null;
                case MOD_OPERATOR:
                    if (r === 0) {
                        return null;
                    }
                    if (l === 0) {
                        return 0;
                    }
                    if ((l < 0 && r > 0) || (l > 0 && r < 0)) {
                        /* Mimic python modulo - result takes sign of the divisor
                         * if one operand is negative. */
                        return -(Math.floor(l / r) * r - l);
                    }
                    return l % r;
                default:
                    throw('Unknown operator: ' + op['operator']);
            }
        }

        return null;
    }

    function _isArrayEqual(l, r) {
        if (l === r) return true;
        if (l === null || r === null) return false;
        if (l.length !== r.length) return false;

        for (var i = 0; i < l.length; i++) {
            if (l[i] !== r[i]) {
                return false;
            }
        }

        return true;
    }

    function _isEqual(l, r) {
        if ( l === null && l === r ) {
            return true;
        }
        if (typeof l === typeof r) {
            switch (typeof l) {
                case 'number':
                case 'string':
                case 'boolean':
                    return l === r;
                case 'object':
                    if (_.isArray(l) && _.isArray(r)) {
                        return _isArrayEqual(l, r);
                    }
                    if (_.isDate(l) && _.isDate(r)) {
                        return l.getTime() === r.getTime();
                    }
                    if (_.isObject(l) && _.isObject(r)) {
                        return JSON.stringify(l) === JSON.stringify(r);
                    }
            }
        }
        return false;
    }

    function evaluateEquality(op, properties) {
        if (!op['operator'] || [EQUALS_OPERATOR, NOT_EQUALS_OPERATOR].indexOf(op['operator']) === -1 || !op['children'] || op['children'].length !== 2) {
            throw ('Invalid equality operator ' + op);
        }

        var v = _isEqual(evaluateSelector(op['children'][0], properties), evaluateSelector(op['children'][1], properties));

        switch (op['operator']) {
            case EQUALS_OPERATOR:
                return v;
            case NOT_EQUALS_OPERATOR:
                return !v;
        }
    }

    function evaluateComparison(op, properties) {
        if (!op['operator'] ||
            [GREATER_OPERATOR, GREATER_EQUAL_OPERATOR, LESS_OPERATOR, LESS_EQUAL_OPERATOR].indexOf(op['operator']) === -1 ||
            !op['children'] || op['children'].length !== 2) {
            throw ('Invalid comparison operator ' + op);
        }
        var l = evaluateSelector(op['children'][0], properties);
        var r = evaluateSelector(op['children'][1], properties);

        if (typeof(l) === typeof(r)) {
            if (typeof(r) === 'number' || _.isDate(r)) {
                l = toNumber(l);
                r = toNumber(r);
                switch (op['operator']) {
                    case GREATER_OPERATOR:
                        return l > r;
                    case GREATER_EQUAL_OPERATOR:
                        return l >= r;
                    case LESS_OPERATOR:
                        return l < r;
                    case LESS_EQUAL_OPERATOR:
                        return l <= r;
                }
            } else if (typeof(r) === 'string') {
                var compare = l.localeCompare(r);
                switch (op['operator']) {
                    case GREATER_OPERATOR:
                        return compare > 0;
                    case GREATER_EQUAL_OPERATOR:
                        return compare >= 0;
                    case LESS_OPERATOR:
                        return compare < 0;
                    case LESS_EQUAL_OPERATOR:
                        return compare <= 0;
                }
            }
        }

        return null;
    }

    function evaluateDefined(op, properties) {
        if (!op['operator'] || [DEFINED_OPERATOR, NOT_DEFINED_OPERATOR].indexOf(op['operator']) === -1 ||
            !op['children'] || op['children'].length !== 1) {
            throw ('Invalid defined/not defined operator: ' + op);
        }

        var b = evaluateSelector(op['children'][0], properties) !== null;
        if (op['operator'] === NOT_DEFINED_OPERATOR) {
            return !b;
        }

        return b;
    }

    function evaluateNot(op, properties) {
        if (!op['operator'] || op['operator'] !== NOT_OPERATOR || !op['children'] || op['children'].length !== 1) {
            throw ('Invalid not operator: ' + op);
        }

        var v = evaluateSelector(op['children'][0], properties);
        if (v === null) {
            return true;
        }

        if (typeof(v) === 'boolean') {
            return !v;
        }

        return null;
    }

    function evaluateOperator(op, properties) {
        if (!op['operator']) {
            throw ('Invalid operator: operator key missing ' + op);
        }

        switch (op['operator']) {
            case AND_OPERATOR:
                return evaluateAnd(op, properties);
            case OR_OPERATOR:
                return evaluateOr(op, properties);
            case IN_OPERATOR:
            case NOT_IN_OPERATOR:
                return evaluateIn(op, properties);
            case PLUS_OPERATOR:
                return evaluatePlus(op, properties);
            case MINUS_OPERATOR:
            case MUL_OPERATOR:
            case DIV_OPERATOR:
            case MOD_OPERATOR:
                return evaluateArithmetic(op, properties);
            case EQUALS_OPERATOR:
            case NOT_EQUALS_OPERATOR:
                return evaluateEquality(op, properties);
            case GREATER_OPERATOR:
            case LESS_OPERATOR:
            case GREATER_EQUAL_OPERATOR:
            case LESS_EQUAL_OPERATOR:
                return evaluateComparison(op, properties);
            case BOOLEAN_OPERATOR:
                return evaluateBoolean(op, properties);
            case DATETIME_OPERATOR:
                return evaluateDateTime(op, properties);
            case LIST_OPERATOR:
                return evaluateList(op, properties);
            case NUMBER_OPERATOR:
                return evaluateNumber(op, properties);
            case STRING_OPERATOR:
                return evaluateString(op, properties);
            case DEFINED_OPERATOR:
            case NOT_DEFINED_OPERATOR:
                return evaluateDefined(op, properties);
            case NOT_OPERATOR:
                return evaluateNot(op, properties);
        }
    }

    function evaluateWindow(value) {
        var win = value[WINDOW_KEY];
        if (!win || !win[UNIT_KEY] || !win[VALUE_KEY]) {
            throw('Invalid window: missing required keys ' + JSON.stringify(value));
        }
        var out = new Date();
        switch (win[UNIT_KEY]) {
            case HOUR_KEY:
                out.setTime(out.getTime() + (win[VALUE_KEY]*-1*60*60*1000));
                break;
            case DAY_KEY:
                out.setTime(out.getTime() + (win[VALUE_KEY]*-1*24*60*60*1000));
                break;
            case WEEK_KEY:
                out.setTime(out.getTime() + (win[VALUE_KEY]*-1*7*24*60*60*1000));
                break;
            case MONTH_KEY:
                out.setTime(out.getTime() + (win[VALUE_KEY]*-1*30*24*60*60*1000));
                break;
            default:
                throw('Invalid unit: ' + win[UNIT_KEY]);
        }

        return out;
    }

    function evaluateOperand(op, properties) {
        if (!op['property'] || !op['value']) {
            throw('Invalid operand: missing required keys ' + op);
        }
        switch (op['property']) {
            case EVENT_PROPERTY:
                if (properties[op['value']] !== undefined) {
                    return properties[op['value']];
                }
                return null;
            case LITERAL_PROPERTY:
                if (op['value'] === NOW_LITERAL) {
                    return new Date();
                }
                if (typeof(op['value']) === 'object') {
                    return evaluateWindow(op['value']);
                }
                return op['value'];
            default:
                throw('Invalid operand: Invalid property type ' + op['property']);
        }
    }

    function evaluateSelector(filters, properties) {
        if (filters[PROPERTY_KEY]) {
            return evaluateOperand(filters, properties);
        }
        if (filters[OPERATOR_KEY]) {
            return evaluateOperator(filters, properties);
        }
    }

    // Internal class for notification display

    var MixpanelNotification = function(notif_data, mixpanel_instance) {
        _.bind_instance_methods(this);

        this.mixpanel          = mixpanel_instance;
        this.persistence       = this.mixpanel['persistence'];
        this.resource_protocol = this.mixpanel.get_config('inapp_protocol');
        this.cdn_host          = this.mixpanel.get_config('cdn');

        this.campaign_id = _.escapeHTML(notif_data['id']);
        this.message_id  = _.escapeHTML(notif_data['message_id']);

        this.body            = (_.escapeHTML(notif_data['body']) || '').replace(/\n/g, '<br/>');
        this.cta             = _.escapeHTML(notif_data['cta']) || 'Close';
        this.notif_type      = _.escapeHTML(notif_data['type']) || 'takeover';
        this.style           = _.escapeHTML(notif_data['style']) || 'light';
        this.title           = _.escapeHTML(notif_data['title']) || '';
        this.video_width     = MixpanelNotification.VIDEO_WIDTH;
        this.video_height    = MixpanelNotification.VIDEO_HEIGHT;

        this.display_triggers = notif_data['display_triggers'] || [];

        // These fields are url-sanitized in the backend already.
        this.dest_url        = notif_data['cta_url'] || null;
        this.image_url       = notif_data['image_url'] || null;
        this.thumb_image_url = notif_data['thumb_image_url'] || null;
        this.video_url       = notif_data['video_url'] || null;

        if (this.thumb_image_url && this.thumb_image_url.indexOf('//') === 0) {
            this.thumb_image_url = this.thumb_image_url.replace('//', this.resource_protocol);
        }

        this.clickthrough = true;
        if (!this.dest_url) {
            this.dest_url = '#dismiss';
            this.clickthrough = false;
        }

        this.mini = this.notif_type === 'mini';
        if (!this.mini) {
            this.notif_type = 'takeover';
        }
        this.notif_width = !this.mini ? MixpanelNotification.NOTIF_WIDTH : MixpanelNotification.NOTIF_WIDTH_MINI;

        this._set_client_config();
        this.imgs_to_preload = this._init_image_html();
        this._init_video();
    };

    MixpanelNotification.ANIM_TIME         = 200;
    MixpanelNotification.MARKUP_PREFIX     = 'mixpanel-notification';
    MixpanelNotification.BG_OPACITY        = 0.6;
    MixpanelNotification.NOTIF_TOP         = 25;
    MixpanelNotification.NOTIF_START_TOP   = 200;
    MixpanelNotification.NOTIF_WIDTH       = 388;
    MixpanelNotification.NOTIF_WIDTH_MINI  = 420;
    MixpanelNotification.NOTIF_HEIGHT_MINI = 85;
    MixpanelNotification.THUMB_BORDER_SIZE = 5;
    MixpanelNotification.THUMB_IMG_SIZE    = 60;
    MixpanelNotification.THUMB_OFFSET      = Math.round(MixpanelNotification.THUMB_IMG_SIZE / 2);
    MixpanelNotification.VIDEO_WIDTH       = 595;
    MixpanelNotification.VIDEO_HEIGHT      = 334;

    MixpanelNotification.prototype.show = function() {
        var self = this;
        this._set_client_config();

        // don't display until HTML body exists
        if (!this.body_el) {
            setTimeout(function() { self.show(); }, 300);
            return;
        }

        this._init_styles();
        this._init_notification_el();

        // wait for any images to load before showing notification
        this._preload_images(this._attach_and_animate);
    };

    MixpanelNotification.prototype.dismiss = _.safewrap(function() {
        if (!this.marked_as_shown) {
            // unexpected condition: user interacted with notif even though we didn't consider it
            // visible (see _mark_as_shown()); send tracking signals to mark delivery
            this._mark_delivery({'invisible': true});
        }

        var exiting_el = this.showing_video ? this._get_el('video') : this._get_notification_display_el();
        if (this.use_transitions) {
            this._remove_class('bg', 'visible');
            this._add_class(exiting_el, 'exiting');
            setTimeout(this._remove_notification_el, MixpanelNotification.ANIM_TIME);
        } else {
            var notif_attr, notif_start, notif_goal;
            if (this.mini) {
                notif_attr  = 'right';
                notif_start = 20;
                notif_goal  = -100;
            } else {
                notif_attr  = 'top';
                notif_start = MixpanelNotification.NOTIF_TOP;
                notif_goal  = MixpanelNotification.NOTIF_START_TOP + MixpanelNotification.NOTIF_TOP;
            }
            this._animate_els([
                {
                    el:    this._get_el('bg'),
                    attr:  'opacity',
                    start: MixpanelNotification.BG_OPACITY,
                    goal:  0.0
                },
                {
                    el:    exiting_el,
                    attr:  'opacity',
                    start: 1.0,
                    goal:  0.0
                },
                {
                    el:    exiting_el,
                    attr:  notif_attr,
                    start: notif_start,
                    goal:  notif_goal
                }
            ], MixpanelNotification.ANIM_TIME, this._remove_notification_el);
        }
    });

    MixpanelNotification.prototype._add_class = _.safewrap(function(el, class_name) {
        class_name = MixpanelNotification.MARKUP_PREFIX + '-' + class_name;
        if (typeof el === 'string') {
            el = this._get_el(el);
        }
        if (!el.className) {
            el.className = class_name;
        } else if (!~(' ' + el.className + ' ').indexOf(' ' + class_name + ' ')) {
            el.className += ' ' + class_name;
        }
    });
    MixpanelNotification.prototype._remove_class = _.safewrap(function(el, class_name) {
        class_name = MixpanelNotification.MARKUP_PREFIX + '-' + class_name;
        if (typeof el === 'string') {
            el = this._get_el(el);
        }
        if (el.className) {
            el.className = (' ' + el.className + ' ')
                .replace(' ' + class_name + ' ', '')
                .replace(/^[\s\xA0]+/, '')
                .replace(/[\s\xA0]+$/, '');
        }
    });

    MixpanelNotification.prototype._animate_els = _.safewrap(function(anims, mss, done_cb, start_time) {
        var self = this,
            in_progress = false,
            ai, anim,
            cur_time = 1 * new Date(), time_diff;

        start_time = start_time || cur_time;
        time_diff = cur_time - start_time;

        for (ai = 0; ai < anims.length; ai++) {
            anim = anims[ai];
            if (typeof anim.val === 'undefined') {
                anim.val = anim.start;
            }
            if (anim.val !== anim.goal) {
                in_progress = true;
                var anim_diff = anim.goal - anim.start,
                    anim_dir = anim.goal >= anim.start ? 1 : -1;
                anim.val = anim.start + anim_diff * time_diff / mss;
                if (anim.attr !== 'opacity') {
                    anim.val = Math.round(anim.val);
                }
                if ((anim_dir > 0 && anim.val >= anim.goal) || (anim_dir < 0 && anim.val <= anim.goal)) {
                    anim.val = anim.goal;
                }
            }
        }
        if (!in_progress) {
            if (done_cb) {
                done_cb();
            }
            return;
        }

        for (ai = 0; ai < anims.length; ai++) {
            anim = anims[ai];
            if (anim.el) {
                var suffix = anim.attr === 'opacity' ? '' : 'px';
                anim.el.style[anim.attr] = String(anim.val) + suffix;
            }
        }
        setTimeout(function() { self._animate_els(anims, mss, done_cb, start_time); }, 10);
    });

    MixpanelNotification.prototype._attach_and_animate = _.safewrap(function() {
        var self = this;

        // no possibility to double-display
        if (this.shown || this._get_shown_campaigns()[this.campaign_id]) {
            return;
        }
        this.shown = true;

        this.body_el.appendChild(this.notification_el);
        setTimeout(function() {
            var notif_el = self._get_notification_display_el();
            if (self.use_transitions) {
                if (!self.mini) {
                    self._add_class('bg', 'visible');
                }
                self._add_class(notif_el, 'visible');
                self._mark_as_shown();
            } else {
                var notif_attr, notif_start, notif_goal;
                if (self.mini) {
                    notif_attr  = 'right';
                    notif_start = -100;
                    notif_goal  = 20;
                } else {
                    notif_attr  = 'top';
                    notif_start = MixpanelNotification.NOTIF_START_TOP + MixpanelNotification.NOTIF_TOP;
                    notif_goal  = MixpanelNotification.NOTIF_TOP;
                }
                self._animate_els([
                    {
                        el:    self._get_el('bg'),
                        attr:  'opacity',
                        start: 0.0,
                        goal:  MixpanelNotification.BG_OPACITY
                    },
                    {
                        el:    notif_el,
                        attr:  'opacity',
                        start: 0.0,
                        goal:  1.0
                    },
                    {
                        el:    notif_el,
                        attr:  notif_attr,
                        start: notif_start,
                        goal:  notif_goal
                    }
                ], MixpanelNotification.ANIM_TIME, self._mark_as_shown);
            }
        }, 100);
        _.register_event(self._get_el('cancel'), 'click', function(e) {
            e.preventDefault();
            self.dismiss();
        });
        var click_el = self._get_el('button') ||
                            self._get_el('mini-content');
        _.register_event(click_el, 'click', function(e) {
            e.preventDefault();
            if (self.show_video) {
                self._track_event('$campaign_open', {'$resource_type': 'video'});
                self._switch_to_video();
            } else {
                self.dismiss();
                if (self.clickthrough) {
                    var tracking_cb = null;
                    if (self.mixpanel.get_config('inapp_link_new_window')) {
                        window.open(self.dest_url);
                    } else {
                        tracking_cb = function() {
                            window.location.href = self.dest_url;
                        };
                    }
                    self._track_event('$campaign_open', {'$resource_type': 'link'}, tracking_cb);
                }
            }
        });
    });

    MixpanelNotification.prototype._get_el = function(id) {
        return document.getElementById(MixpanelNotification.MARKUP_PREFIX + '-' + id);
    };

    MixpanelNotification.prototype._get_notification_display_el = function() {
        return this._get_el(this.notif_type);
    };

    MixpanelNotification.prototype._get_shown_campaigns = function() {
        return this.persistence['props'][CAMPAIGN_IDS_KEY] || (this.persistence['props'][CAMPAIGN_IDS_KEY] = {});
    };

    MixpanelNotification.prototype._matches_event_data = _.safewrap(function(event_data) {
        var event_name = event_data['event'] || '';
        for (var i = 0; i < this.display_triggers.length; i++) {
            var display_trigger = this.display_triggers[i];
            var match_event = display_trigger['event'] || '';
            if (match_event === '$any_event' || event_name === display_trigger['event']) {
                if (display_trigger['selector'] && !_.isEmptyObject(display_trigger['selector'])) {
                    if (evaluateSelector(display_trigger['selector'], event_data['properties'])) {
                        return true;
                    }
                } else {
                    return true;
                }
            }
        }
        return false;
    });


    MixpanelNotification.prototype._browser_lte = function(browser, version) {
        return this.browser_versions[browser] && this.browser_versions[browser] <= version;
    };

    MixpanelNotification.prototype._init_image_html = function() {
        var imgs_to_preload = [];

        if (!this.mini) {
            if (this.image_url) {
                imgs_to_preload.push(this.image_url);
                this.img_html = '<img id="img" src="' + this.image_url + '"/>';
            } else {
                this.img_html = '';
            }
            if (this.thumb_image_url) {
                imgs_to_preload.push(this.thumb_image_url);
                this.thumb_img_html =
                        '<div id="thumbborder-wrapper"><div id="thumbborder"></div></div>' +
                        '<img id="thumbnail"' +
                            ' src="' + this.thumb_image_url + '"' +
                            ' width="' + MixpanelNotification.THUMB_IMG_SIZE + '"' +
                            ' height="' + MixpanelNotification.THUMB_IMG_SIZE + '"' +
                        '/>' +
                        '<div id="thumbspacer"></div>';
            } else {
                this.thumb_img_html = '';
            }
        } else {
            this.thumb_image_url = this.thumb_image_url || (this.cdn_host + '/site_media/images/icons/notifications/mini-news-dark.png');
            imgs_to_preload.push(this.thumb_image_url);
        }

        return imgs_to_preload;
    };

    MixpanelNotification.prototype._init_notification_el = function() {
        var notification_html = '';
        var video_src         = '';
        var video_html        = '';
        var cancel_html       = '<div id="cancel">' +
                                        '<div id="cancel-icon"></div>' +
                                    '</div>';

        this.notification_el = document.createElement('div');
        this.notification_el.id = MixpanelNotification.MARKUP_PREFIX + '-wrapper';
        if (!this.mini) {
            // TAKEOVER notification
            var close_html  = (this.clickthrough || this.show_video) ? '' : '<div id="button-close"></div>',
                play_html   = this.show_video ? '<div id="button-play"></div>' : '';
            if (this._browser_lte('ie', 7)) {
                close_html = '';
                play_html = '';
            }
            notification_html =
                    '<div id="takeover">' +
                        this.thumb_img_html +
                        '<div id="mainbox">' +
                            cancel_html +
                            '<div id="content">' +
                                this.img_html +
                                '<div id="title">' + this.title + '</div>' +
                                '<div id="body">' + this.body + '</div>' +
                                '<div id="tagline">' +
                                    '<a href="http://mixpanel.com?from=inapp" target="_blank">POWERED BY MIXPANEL</a>' +
                                '</div>' +
                            '</div>' +
                            '<div id="button">' +
                                close_html +
                                '<a id="button-link" href="' + this.dest_url + '">' + this.cta + '</a>' +
                                play_html +
                            '</div>' +
                        '</div>' +
                    '</div>';
        } else {
            // MINI notification
            notification_html =
                    '<div id="mini">' +
                        '<div id="mainbox">' +
                            cancel_html +
                            '<div id="mini-content">' +
                                '<div id="mini-icon">' +
                                    '<div id="mini-icon-img"></div>' +
                                '</div>' +
                                '<div id="body">' +
                                    '<div id="body-text"><div>' + this.body + '</div></div>' +
                                '</div>' +
                            '</div>' +
                        '</div>' +
                        '<div id="mini-border"></div>' +
                    '</div>';
        }
        if (this.youtube_video) {
            video_src = this.resource_protocol + 'www.youtube.com/embed/' + this.youtube_video +
                    '?wmode=transparent&showinfo=0&modestbranding=0&rel=0&autoplay=1&loop=0&vq=hd1080';
            if (this.yt_custom) {
                video_src += '&enablejsapi=1&html5=1&controls=0';
                video_html =
                        '<div id="video-controls">' +
                            '<div id="video-progress" class="video-progress-el">' +
                                '<div id="video-progress-total" class="video-progress-el"></div>' +
                                '<div id="video-elapsed" class="video-progress-el"></div>' +
                            '</div>' +
                            '<div id="video-time" class="video-progress-el"></div>' +
                        '</div>';
            }
        } else if (this.vimeo_video) {
            video_src = this.resource_protocol + 'player.vimeo.com/video/' + this.vimeo_video + '?autoplay=1&title=0&byline=0&portrait=0';
        }
        if (this.show_video) {
            this.video_iframe =
                    '<iframe id="' + MixpanelNotification.MARKUP_PREFIX + '-video-frame" ' +
                        'width="' + this.video_width + '" height="' + this.video_height + '" ' +
                        ' src="' + video_src + '"' +
                        ' frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen="1" scrolling="no"' +
                    '></iframe>';
            video_html =
                    '<div id="video-' + (this.flip_animate ? '' : 'no') + 'flip">' +
                        '<div id="video">' +
                            '<div id="video-holder"></div>' +
                            video_html +
                        '</div>' +
                    '</div>';
        }
        var main_html = video_html + notification_html;
        if (this.flip_animate) {
            main_html =
                    (this.mini ? notification_html : '') +
                    '<div id="flipcontainer"><div id="flipper">' +
                        (this.mini ? video_html : main_html) +
                    '</div></div>';
        }

        this.notification_el.innerHTML =
            ('<div id="overlay" class="' + this.notif_type + '">' +
                '<div id="campaignid-' + this.campaign_id + '">' +
                    '<div id="bgwrapper">' +
                        '<div id="bg"></div>' +
                        main_html +
                    '</div>' +
                '</div>' +
            '</div>')
                .replace(/class="/g, 'class="' + MixpanelNotification.MARKUP_PREFIX + '-')
                .replace(/id="/g, 'id="' + MixpanelNotification.MARKUP_PREFIX + '-');
    };

    MixpanelNotification.prototype._init_styles = function() {
        if (this.style === 'dark') {
            this.style_vals = {
                bg:             '#1d1f25',
                bg_actions:     '#282b32',
                bg_hover:       '#3a4147',
                bg_light:       '#4a5157',
                border_gray:    '#32353c',
                cancel_opacity: '0.4',
                mini_hover:     '#2a3137',
                text_title:     '#fff',
                text_main:      '#9498a3',
                text_tagline:   '#464851',
                text_hover:     '#ddd'
            };
        } else {
            this.style_vals = {
                bg:             '#fff',
                bg_actions:     '#e7eaee',
                bg_hover:       '#eceff3',
                bg_light:       '#f5f5f5',
                border_gray:    '#e4ecf2',
                cancel_opacity: '1.0',
                mini_hover:     '#fafafa',
                text_title:     '#5c6578',
                text_main:      '#8b949b',
                text_tagline:   '#ced9e6',
                text_hover:     '#7c8598'
            };
        }
        var shadow = '0px 0px 35px 0px rgba(45, 49, 56, 0.7)',
            video_shadow = shadow,
            mini_shadow = shadow,
            thumb_total_size = MixpanelNotification.THUMB_IMG_SIZE + MixpanelNotification.THUMB_BORDER_SIZE * 2,
            anim_seconds = (MixpanelNotification.ANIM_TIME / 1000) + 's';
        if (this.mini) {
            shadow = 'none';
        }

        // don't display on small viewports
        var notif_media_queries = {},
            min_width = MixpanelNotification.NOTIF_WIDTH_MINI + 20;
        notif_media_queries['@media only screen and (max-width: ' + (min_width - 1) + 'px)'] = {
            '#overlay': {
                'display': 'none'
            }
        };
        var notif_styles = {
            '.flipped': {
                'transform': 'rotateY(180deg)'
            },
            '#overlay': {
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '100%',
                'overflow': 'auto',
                'text-align': 'center',
                'z-index': '10000',
                'font-family': '"Helvetica", "Arial", sans-serif',
                '-webkit-font-smoothing': 'antialiased',
                '-moz-osx-font-smoothing': 'grayscale'
            },
            '#overlay.mini': {
                'height': '0',
                'overflow': 'visible'
            },
            '#overlay a': {
                'width': 'initial',
                'padding': '0',
                'text-decoration': 'none',
                'text-transform': 'none',
                'color': 'inherit'
            },
            '#bgwrapper': {
                'position': 'relative',
                'width': '100%',
                'height': '100%'
            },
            '#bg': {
                'position': 'fixed',
                'top': '0',
                'left': '0',
                'width': '100%',
                'height': '100%',
                'min-width': this.doc_width * 4 + 'px',
                'min-height': this.doc_height * 4 + 'px',
                'background-color': 'black',
                'opacity': '0.0',
                '-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=60)', // IE8
                'filter': 'alpha(opacity=60)', // IE5-7
                'transition': 'opacity ' + anim_seconds
            },
            '#bg.visible': {
                'opacity': MixpanelNotification.BG_OPACITY
            },
            '.mini #bg': {
                'width': '0',
                'height': '0',
                'min-width': '0'
            },
            '#flipcontainer': {
                'perspective': '1000px',
                'position': 'absolute',
                'width': '100%'
            },
            '#flipper': {
                'position': 'relative',
                'transform-style': 'preserve-3d',
                'transition': '0.3s'
            },
            '#takeover': {
                'position': 'absolute',
                'left': '50%',
                'width': MixpanelNotification.NOTIF_WIDTH + 'px',
                'margin-left': Math.round(-MixpanelNotification.NOTIF_WIDTH / 2) + 'px',
                'backface-visibility': 'hidden',
                'transform': 'rotateY(0deg)',
                'opacity': '0.0',
                'top': MixpanelNotification.NOTIF_START_TOP + 'px',
                'transition': 'opacity ' + anim_seconds + ', top ' + anim_seconds
            },
            '#takeover.visible': {
                'opacity': '1.0',
                'top': MixpanelNotification.NOTIF_TOP + 'px'
            },
            '#takeover.exiting': {
                'opacity': '0.0',
                'top': MixpanelNotification.NOTIF_START_TOP + 'px'
            },
            '#thumbspacer': {
                'height': MixpanelNotification.THUMB_OFFSET + 'px'
            },
            '#thumbborder-wrapper': {
                'position': 'absolute',
                'top': (-MixpanelNotification.THUMB_BORDER_SIZE) + 'px',
                'left': (MixpanelNotification.NOTIF_WIDTH / 2 - MixpanelNotification.THUMB_OFFSET - MixpanelNotification.THUMB_BORDER_SIZE) + 'px',
                'width': thumb_total_size + 'px',
                'height': (thumb_total_size / 2) + 'px',
                'overflow': 'hidden'
            },
            '#thumbborder': {
                'position': 'absolute',
                'width': thumb_total_size + 'px',
                'height': thumb_total_size + 'px',
                'border-radius': thumb_total_size + 'px',
                'background-color': this.style_vals.bg_actions,
                'opacity': '0.5'
            },
            '#thumbnail': {
                'position': 'absolute',
                'top': '0px',
                'left': (MixpanelNotification.NOTIF_WIDTH / 2 - MixpanelNotification.THUMB_OFFSET) + 'px',
                'width': MixpanelNotification.THUMB_IMG_SIZE + 'px',
                'height': MixpanelNotification.THUMB_IMG_SIZE + 'px',
                'overflow': 'hidden',
                'z-index': '100',
                'border-radius': MixpanelNotification.THUMB_IMG_SIZE + 'px'
            },
            '#mini': {
                'position': 'absolute',
                'right': '20px',
                'top': MixpanelNotification.NOTIF_TOP + 'px',
                'width': this.notif_width + 'px',
                'height': MixpanelNotification.NOTIF_HEIGHT_MINI * 2 + 'px',
                'margin-top': 20 - MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
                'backface-visibility': 'hidden',
                'opacity': '0.0',
                'transform': 'rotateX(90deg)',
                'transition': 'opacity 0.3s, transform 0.3s, right 0.3s'
            },
            '#mini.visible': {
                'opacity': '1.0',
                'transform': 'rotateX(0deg)'
            },
            '#mini.exiting': {
                'opacity': '0.0',
                'right': '-150px'
            },
            '#mainbox': {
                'border-radius': '4px',
                'box-shadow': shadow,
                'text-align': 'center',
                'background-color': this.style_vals.bg,
                'font-size': '14px',
                'color': this.style_vals.text_main
            },
            '#mini #mainbox': {
                'height': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
                'margin-top': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
                'border-radius': '3px',
                'transition': 'background-color ' + anim_seconds
            },
            '#mini-border': {
                'height': (MixpanelNotification.NOTIF_HEIGHT_MINI + 6) + 'px',
                'width': (MixpanelNotification.NOTIF_WIDTH_MINI + 6) + 'px',
                'position': 'absolute',
                'top': '-3px',
                'left': '-3px',
                'margin-top': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
                'border-radius': '6px',
                'opacity': '0.25',
                'background-color': '#fff',
                'z-index': '-1',
                'box-shadow': mini_shadow
            },
            '#mini-icon': {
                'position': 'relative',
                'display': 'inline-block',
                'width': '75px',
                'height': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
                'border-radius': '3px 0 0 3px',
                'background-color': this.style_vals.bg_actions,
                'background': 'linear-gradient(135deg, ' + this.style_vals.bg_light + ' 0%, ' + this.style_vals.bg_actions + ' 100%)',
                'transition': 'background-color ' + anim_seconds
            },
            '#mini:hover #mini-icon': {
                'background-color': this.style_vals.mini_hover
            },
            '#mini:hover #mainbox': {
                'background-color': this.style_vals.mini_hover
            },
            '#mini-icon-img': {
                'position': 'absolute',
                'background-image': 'url(' + this.thumb_image_url + ')',
                'width': '48px',
                'height': '48px',
                'top': '20px',
                'left': '12px'
            },
            '#content': {
                'padding': '30px 20px 0px 20px'
            },
            '#mini-content': {
                'text-align': 'left',
                'height': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
                'cursor': 'pointer'
            },
            '#img': {
                'width': '328px',
                'margin-top': '30px',
                'border-radius': '5px'
            },
            '#title': {
                'max-height': '600px',
                'overflow': 'hidden',
                'word-wrap': 'break-word',
                'padding': '25px 0px 20px 0px',
                'font-size': '19px',
                'font-weight': 'bold',
                'color': this.style_vals.text_title
            },
            '#body': {
                'max-height': '600px',
                'margin-bottom': '25px',
                'overflow': 'hidden',
                'word-wrap': 'break-word',
                'line-height': '21px',
                'font-size': '15px',
                'font-weight': 'normal',
                'text-align': 'left'
            },
            '#mini #body': {
                'display': 'inline-block',
                'max-width': '250px',
                'margin': '0 0 0 30px',
                'height': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px',
                'font-size': '16px',
                'letter-spacing': '0.8px',
                'color': this.style_vals.text_title
            },
            '#mini #body-text': {
                'display': 'table',
                'height': MixpanelNotification.NOTIF_HEIGHT_MINI + 'px'
            },
            '#mini #body-text div': {
                'display': 'table-cell',
                'vertical-align': 'middle'
            },
            '#tagline': {
                'margin-bottom': '15px',
                'font-size': '10px',
                'font-weight': '600',
                'letter-spacing': '0.8px',
                'color': '#ccd7e0',
                'text-align': 'left'
            },
            '#tagline a': {
                'color': this.style_vals.text_tagline,
                'transition': 'color ' + anim_seconds
            },
            '#tagline a:hover': {
                'color': this.style_vals.text_hover
            },
            '#cancel': {
                'position': 'absolute',
                'right': '0',
                'width': '8px',
                'height': '8px',
                'padding': '10px',
                'border-radius': '20px',
                'margin': '12px 12px 0 0',
                'box-sizing': 'content-box',
                'cursor': 'pointer',
                'transition': 'background-color ' + anim_seconds
            },
            '#mini #cancel': {
                'margin': '7px 7px 0 0'
            },
            '#cancel-icon': {
                'width': '8px',
                'height': '8px',
                'overflow': 'hidden',
                'background-image': 'url(' + this.cdn_host + '/site_media/images/icons/notifications/cancel-x.png)',
                'opacity': this.style_vals.cancel_opacity
            },
            '#cancel:hover': {
                'background-color': this.style_vals.bg_hover
            },
            '#button': {
                'display': 'block',
                'height': '60px',
                'line-height': '60px',
                'text-align': 'center',
                'background-color': this.style_vals.bg_actions,
                'border-radius': '0 0 4px 4px',
                'overflow': 'hidden',
                'cursor': 'pointer',
                'transition': 'background-color ' + anim_seconds
            },
            '#button-close': {
                'display': 'inline-block',
                'width': '9px',
                'height': '60px',
                'margin-right': '8px',
                'vertical-align': 'top',
                'background-image': 'url(' + this.cdn_host + '/site_media/images/icons/notifications/close-x-' + this.style + '.png)',
                'background-repeat': 'no-repeat',
                'background-position': '0px 25px'
            },
            '#button-play': {
                'display': 'inline-block',
                'width': '30px',
                'height': '60px',
                'margin-left': '15px',
                'background-image': 'url(' + this.cdn_host + '/site_media/images/icons/notifications/play-' + this.style + '-small.png)',
                'background-repeat': 'no-repeat',
                'background-position': '0px 15px'
            },
            'a#button-link': {
                'display': 'inline-block',
                'vertical-align': 'top',
                'text-align': 'center',
                'font-size': '17px',
                'font-weight': 'bold',
                'overflow': 'hidden',
                'word-wrap': 'break-word',
                'color': this.style_vals.text_title,
                'transition': 'color ' + anim_seconds
            },
            '#button:hover': {
                'background-color': this.style_vals.bg_hover,
                'color': this.style_vals.text_hover
            },
            '#button:hover a': {
                'color': this.style_vals.text_hover
            },

            '#video-noflip': {
                'position': 'relative',
                'top': (-this.video_height * 2) + 'px'
            },
            '#video-flip': {
                'backface-visibility': 'hidden',
                'transform': 'rotateY(180deg)'
            },
            '#video': {
                'position': 'absolute',
                'width': (this.video_width - 1) + 'px',
                'height': this.video_height + 'px',
                'top': MixpanelNotification.NOTIF_TOP + 'px',
                'margin-top': '100px',
                'left': '50%',
                'margin-left': Math.round(-this.video_width / 2) + 'px',
                'overflow': 'hidden',
                'border-radius': '5px',
                'box-shadow': video_shadow,
                'transform': 'translateZ(1px)', // webkit rendering bug http://stackoverflow.com/questions/18167981/clickable-link-area-unexpectedly-smaller-after-css-transform
                'transition': 'opacity ' + anim_seconds + ', top ' + anim_seconds
            },
            '#video.exiting': {
                'opacity': '0.0',
                'top': this.video_height + 'px'
            },
            '#video-holder': {
                'position': 'absolute',
                'width': (this.video_width - 1) + 'px',
                'height': this.video_height + 'px',
                'overflow': 'hidden',
                'border-radius': '5px'
            },
            '#video-frame': {
                'margin-left': '-1px',
                'width': this.video_width + 'px'
            },
            '#video-controls': {
                'opacity': '0',
                'transition': 'opacity 0.5s'
            },
            '#video:hover #video-controls': {
                'opacity': '1.0'
            },
            '#video .video-progress-el': {
                'position': 'absolute',
                'bottom': '0',
                'height': '25px',
                'border-radius': '0 0 0 5px'
            },
            '#video-progress': {
                'width': '90%'
            },
            '#video-progress-total': {
                'width': '100%',
                'background-color': this.style_vals.bg,
                'opacity': '0.7'
            },
            '#video-elapsed': {
                'width': '0',
                'background-color': '#6cb6f5',
                'opacity': '0.9'
            },
            '#video #video-time': {
                'width': '10%',
                'right': '0',
                'font-size': '11px',
                'line-height': '25px',
                'color': this.style_vals.text_main,
                'background-color': '#666',
                'border-radius': '0 0 5px 0'
            }
        };

        // IE hacks
        if (this._browser_lte('ie', 8)) {
            _.extend(notif_styles, {
                '* html #overlay': {
                    'position': 'absolute'
                },
                '* html #bg': {
                    'position': 'absolute'
                },
                'html, body': {
                    'height': '100%'
                }
            });
        }
        if (this._browser_lte('ie', 7)) {
            _.extend(notif_styles, {
                '#mini #body': {
                    'display': 'inline',
                    'zoom': '1',
                    'border': '1px solid ' + this.style_vals.bg_hover
                },
                '#mini #body-text': {
                    'padding': '20px'
                },
                '#mini #mini-icon': {
                    'display': 'none'
                }
            });
        }

        // add vendor-prefixed style rules
        var VENDOR_STYLES = [
                'backface-visibility', 'border-radius', 'box-shadow', 'opacity',
                'perspective', 'transform', 'transform-style', 'transition'
            ],
            VENDOR_PREFIXES = ['khtml', 'moz', 'ms', 'o', 'webkit'];
        for (var selector in notif_styles) {
            for (var si = 0; si < VENDOR_STYLES.length; si++) {
                var prop = VENDOR_STYLES[si];
                if (prop in notif_styles[selector]) {
                    var val = notif_styles[selector][prop];
                    for (var pi = 0; pi < VENDOR_PREFIXES.length; pi++) {
                        notif_styles[selector]['-' + VENDOR_PREFIXES[pi] + '-' + prop] = val;
                    }
                }
            }
        }

        var inject_styles = function(styles, media_queries) {
            var create_style_text = function(style_defs) {
                var st = '';
                for (var selector in style_defs) {
                    var mp_selector = selector
                        .replace(/#/g, '#' + MixpanelNotification.MARKUP_PREFIX + '-')
                        .replace(/\./g, '.' + MixpanelNotification.MARKUP_PREFIX + '-');
                    st += '\n' + mp_selector + ' {';
                    var props = style_defs[selector];
                    for (var k in props) {
                        st += k + ':' + props[k] + ';';
                    }
                    st += '}';
                }
                return st;
            };
            var create_media_query_text = function(mq_defs) {
                var mqt = '';
                for (var mq in mq_defs) {
                    mqt += '\n' + mq + ' {' + create_style_text(mq_defs[mq]) + '\n}';
                }
                return mqt;
            };

            var style_text = create_style_text(styles) + create_media_query_text(media_queries),
                head_el = document.head || document.getElementsByTagName('head')[0] || document.documentElement,
                style_el = document.createElement('style');
            head_el.appendChild(style_el);
            style_el.setAttribute('type', 'text/css');
            if (style_el.styleSheet) { // IE
                style_el.styleSheet.cssText = style_text;
            } else {
                style_el.textContent = style_text;
            }
        };
        inject_styles(notif_styles, notif_media_queries);
    };

    MixpanelNotification.prototype._init_video = _.safewrap(function() {
        if (!this.video_url) {
            return;
        }
        var self = this;

        // Youtube iframe API compatibility
        self.yt_custom = 'postMessage' in window;

        self.dest_url = self.video_url;
        var youtube_match = self.video_url.match(
                // http://stackoverflow.com/questions/2936467/parse-youtube-video-id-using-preg-match
                /(?:youtube(?:-nocookie)?\.com\/(?:[^/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?/ ]{11})/i
            ),
            vimeo_match = self.video_url.match(
                /vimeo\.com\/.*?(\d+)/i
            );
        if (youtube_match) {
            self.show_video = true;
            self.youtube_video = youtube_match[1];

            if (self.yt_custom) {
                window['onYouTubeIframeAPIReady'] = function() {
                    if (self._get_el('video-frame')) {
                        self._yt_video_ready();
                    }
                };

                // load Youtube iframe API; see https://developers.google.com/youtube/iframe_api_reference
                var tag = document.createElement('script');
                tag.src = self.resource_protocol + 'www.youtube.com/iframe_api';
                var firstScriptTag = document.getElementsByTagName('script')[0];
                firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
            }
        } else if (vimeo_match) {
            self.show_video = true;
            self.vimeo_video = vimeo_match[1];
        }

        // IE <= 7, FF <= 3: fall through to video link rather than embedded player
        if (self._browser_lte('ie', 7) || self._browser_lte('firefox', 3)) {
            self.show_video = false;
            self.clickthrough = true;
        }
    });

    MixpanelNotification.prototype._mark_as_shown = _.safewrap(function() {
        // click on background to dismiss
        var self = this;
        _.register_event(self._get_el('bg'), 'click', function() {
            self.dismiss();
        });

        var get_style = function(el, style_name) {
            var styles = {};
            if (document.defaultView && document.defaultView.getComputedStyle) {
                styles = document.defaultView.getComputedStyle(el, null); // FF3 requires both args
            } else if (el.currentStyle) { // IE
                styles = el.currentStyle;
            }
            return styles[style_name];
        };

        if (this.campaign_id) {
            var notif_el = this._get_el('overlay');
            if (notif_el && get_style(notif_el, 'visibility') !== 'hidden' && get_style(notif_el, 'display') !== 'none') {
                this._mark_delivery();
            }
        }
    });

    MixpanelNotification.prototype._mark_delivery = _.safewrap(function(extra_props) {
        if (!this.marked_as_shown) {
            this.marked_as_shown = true;

            if (this.campaign_id) {
                // mark notification shown (local cache)
                this._get_shown_campaigns()[this.campaign_id] = 1 * new Date();
                this.persistence.save();
            }

            // track delivery
            this._track_event('$campaign_delivery', extra_props);

            // mark notification shown (mixpanel property)
            this.mixpanel['people']['append']({
                '$campaigns': this.campaign_id,
                '$notifications': {
                    'campaign_id': this.campaign_id,
                    'message_id':  this.message_id,
                    'type':        'web',
                    'time':        new Date()
                }
            });
        }
    });

    MixpanelNotification.prototype._preload_images = function(all_loaded_cb) {
        var self = this;
        if (this.imgs_to_preload.length === 0) {
            all_loaded_cb();
            return;
        }

        var preloaded_imgs = 0;
        var img_objs = [];
        var onload = function() {
            preloaded_imgs++;
            if (preloaded_imgs === self.imgs_to_preload.length && all_loaded_cb) {
                all_loaded_cb();
                all_loaded_cb = null;
            }
        };
        for (var i = 0; i < this.imgs_to_preload.length; i++) {
            var img = new Image();
            img.onload = onload;
            img.src = this.imgs_to_preload[i];
            if (img.complete) {
                onload();
            }
            img_objs.push(img);
        }

        // IE6/7 doesn't fire onload reliably
        if (this._browser_lte('ie', 7)) {
            setTimeout(function() {
                var imgs_loaded = true;
                for (i = 0; i < img_objs.length; i++) {
                    if (!img_objs[i].complete) {
                        imgs_loaded = false;
                    }
                }
                if (imgs_loaded && all_loaded_cb) {
                    all_loaded_cb();
                    all_loaded_cb = null;
                }
            }, 500);
        }
    };

    MixpanelNotification.prototype._remove_notification_el = _.safewrap(function() {
        window.clearInterval(this._video_progress_checker);
        this.notification_el.style.visibility = 'hidden';
        this.body_el.removeChild(this.notification_el);
    });

    MixpanelNotification.prototype._set_client_config = function() {
        var get_browser_version = function(browser_ex) {
            var match = navigator.userAgent.match(browser_ex);
            return match && match[1];
        };
        this.browser_versions = {};
        this.browser_versions['chrome']  = get_browser_version(/Chrome\/(\d+)/);
        this.browser_versions['firefox'] = get_browser_version(/Firefox\/(\d+)/);
        this.browser_versions['ie']      = get_browser_version(/MSIE (\d+).+/);
        if (!this.browser_versions['ie'] && !(window.ActiveXObject) && 'ActiveXObject' in window) {
            this.browser_versions['ie'] = 11;
        }

        this.body_el = document.body || document.getElementsByTagName('body')[0];
        if (this.body_el) {
            this.doc_width = Math.max(
                this.body_el.scrollWidth, document.documentElement.scrollWidth,
                this.body_el.offsetWidth, document.documentElement.offsetWidth,
                this.body_el.clientWidth, document.documentElement.clientWidth
            );
            this.doc_height = Math.max(
                this.body_el.scrollHeight, document.documentElement.scrollHeight,
                this.body_el.offsetHeight, document.documentElement.offsetHeight,
                this.body_el.clientHeight, document.documentElement.clientHeight
            );
        }

        // detect CSS compatibility
        var ie_ver = this.browser_versions['ie'];
        var sample_styles = document.createElement('div').style,
            is_css_compatible = function(rule) {
                if (rule in sample_styles) {
                    return true;
                }
                if (!ie_ver) {
                    rule = rule[0].toUpperCase() + rule.slice(1);
                    var props = ['O' + rule, 'Webkit' + rule, 'Moz' + rule];
                    for (var i = 0; i < props.length; i++) {
                        if (props[i] in sample_styles) {
                            return true;
                        }
                    }
                }
                return false;
            };
        this.use_transitions = this.body_el &&
            is_css_compatible('transition') &&
            is_css_compatible('transform');
        this.flip_animate = (this.browser_versions['chrome'] >= 33 || this.browser_versions['firefox'] >= 15) &&
            this.body_el &&
            is_css_compatible('backfaceVisibility') &&
            is_css_compatible('perspective') &&
            is_css_compatible('transform');
    };

    MixpanelNotification.prototype._switch_to_video = _.safewrap(function() {
        var self = this,
            anims = [
                {
                    el:    self._get_notification_display_el(),
                    attr:  'opacity',
                    start: 1.0,
                    goal:  0.0
                },
                {
                    el:    self._get_notification_display_el(),
                    attr:  'top',
                    start: MixpanelNotification.NOTIF_TOP,
                    goal:  -500
                },
                {
                    el:    self._get_el('video-noflip'),
                    attr:  'opacity',
                    start: 0.0,
                    goal:  1.0
                },
                {
                    el:    self._get_el('video-noflip'),
                    attr:  'top',
                    start: -self.video_height * 2,
                    goal:  0
                }
            ];

        if (self.mini) {
            var bg = self._get_el('bg'),
                overlay = self._get_el('overlay');
            bg.style.width = '100%';
            bg.style.height = '100%';
            overlay.style.width = '100%';

            self._add_class(self._get_notification_display_el(), 'exiting');
            self._add_class(bg, 'visible');

            anims.push({
                el:    self._get_el('bg'),
                attr:  'opacity',
                start: 0.0,
                goal:  MixpanelNotification.BG_OPACITY
            });
        }

        var video_el = self._get_el('video-holder');
        video_el.innerHTML = self.video_iframe;

        var video_ready = function() {
            if (window['YT'] && window['YT']['loaded']) {
                self._yt_video_ready();
            }
            self.showing_video = true;
            self._get_notification_display_el().style.visibility = 'hidden';
        };
        if (self.flip_animate) {
            self._add_class('flipper', 'flipped');
            setTimeout(video_ready, MixpanelNotification.ANIM_TIME);
        } else {
            self._animate_els(anims, MixpanelNotification.ANIM_TIME, video_ready);
        }
    });

    MixpanelNotification.prototype._track_event = function(event_name, properties, cb) {
        if (this.campaign_id) {
            properties = properties || {};
            properties = _.extend(properties, {
                'campaign_id':     this.campaign_id,
                'message_id':      this.message_id,
                'message_type':    'web_inapp',
                'message_subtype': this.notif_type
            });
            this.mixpanel['track'](event_name, properties, cb);
        } else if (cb) {
            cb.call();
        }
    };

    MixpanelNotification.prototype._yt_video_ready = _.safewrap(function() {
        var self = this;
        if (self.video_inited) {
            return;
        }
        self.video_inited = true;

        var progress_bar  = self._get_el('video-elapsed'),
            progress_time = self._get_el('video-time'),
            progress_el   = self._get_el('video-progress');

        new window['YT']['Player'](MixpanelNotification.MARKUP_PREFIX + '-video-frame', {
            'events': {
                'onReady': function(event) {
                    var ytplayer = event['target'],
                        video_duration = ytplayer['getDuration'](),
                        pad = function(i) {
                            return ('00' + i).slice(-2);
                        },
                        update_video_time = function(current_time) {
                            var secs = Math.round(video_duration - current_time),
                                mins = Math.floor(secs / 60),
                                hours = Math.floor(mins / 60);
                            secs -= mins * 60;
                            mins -= hours * 60;
                            progress_time.innerHTML = '-' + (hours ? hours + ':' : '') + pad(mins) + ':' + pad(secs);
                        };
                    update_video_time(0);
                    self._video_progress_checker = window.setInterval(function() {
                        var current_time = ytplayer['getCurrentTime']();
                        progress_bar.style.width = (current_time / video_duration * 100) + '%';
                        update_video_time(current_time);
                    }, 250);
                    _.register_event(progress_el, 'click', function(e) {
                        var clickx = Math.max(0, e.pageX - progress_el.getBoundingClientRect().left);
                        ytplayer['seekTo'](video_duration * clickx / progress_el.clientWidth, true);
                    });
                }
            }
        });
    });

    /**
     * Mixpanel People Object
     * @constructor
     */
    var MixpanelPeople = function() {};

    _.extend(MixpanelPeople.prototype, apiActions);

    MixpanelPeople.prototype._init = function(mixpanel_instance) {
        this._mixpanel = mixpanel_instance;
    };

    /*
    * Set properties on a user record.
    *
    * ### Usage:
    *
    *     mixpanel.people.set('gender', 'm');
    *
    *     // or set multiple properties at once
    *     mixpanel.people.set({
    *         'Company': 'Acme',
    *         'Plan': 'Premium',
    *         'Upgrade date': new Date()
    *     });
    *     // properties can be strings, integers, dates, or lists
    *
    * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
    * @param {*} [to] A value to set on the given property name
    * @param {Function} [callback] If provided, the callback will be called after tracking the event.
    */
    MixpanelPeople.prototype.set = addOptOutCheckMixpanelPeople(function(prop, to, callback) {
        var data = this.set_action(prop, to);
        if (_.isObject(prop)) {
            callback = to;
        }
        // make sure that the referrer info has been updated and saved
        if (this._get_config('save_referrer')) {
            this._mixpanel['persistence'].update_referrer_info(document.referrer);
        }

        // update $set object with default people properties
        data[SET_ACTION] = _.extend(
            {},
            _.info.people_properties(),
            this._mixpanel['persistence'].get_referrer_info(),
            data[SET_ACTION]
        );
        return this._send_request(data, callback);
    });

    /*
    * Set properties on a user record, only if they do not yet exist.
    * This will not overwrite previous people property values, unlike
    * people.set().
    *
    * ### Usage:
    *
    *     mixpanel.people.set_once('First Login Date', new Date());
    *
    *     // or set multiple properties at once
    *     mixpanel.people.set_once({
    *         'First Login Date': new Date(),
    *         'Starting Plan': 'Premium'
    *     });
    *
    *     // properties can be strings, integers or dates
    *
    * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and values.
    * @param {*} [to] A value to set on the given property name
    * @param {Function} [callback] If provided, the callback will be called after tracking the event.
    */
    MixpanelPeople.prototype.set_once = addOptOutCheckMixpanelPeople(function(prop, to, callback) {
        var data = this.set_once_action(prop, to);
        if (_.isObject(prop)) {
            callback = to;
        }
        return this._send_request(data, callback);
    });

    /*
    * Unset properties on a user record (permanently removes the properties and their values from a profile).
    *
    * ### Usage:
    *
    *     mixpanel.people.unset('gender');
    *
    *     // or unset multiple properties at once
    *     mixpanel.people.unset(['gender', 'Company']);
    *
    * @param {Array|String} prop If a string, this is the name of the property. If an array, this is a list of property names.
    * @param {Function} [callback] If provided, the callback will be called after tracking the event.
    */
    MixpanelPeople.prototype.unset = addOptOutCheckMixpanelPeople(function(prop, callback) {
        var data = this.unset_action(prop);
        return this._send_request(data, callback);
    });

    /*
    * Increment/decrement numeric people analytics properties.
    *
    * ### Usage:
    *
    *     mixpanel.people.increment('page_views', 1);
    *
    *     // or, for convenience, if you're just incrementing a counter by
    *     // 1, you can simply do
    *     mixpanel.people.increment('page_views');
    *
    *     // to decrement a counter, pass a negative number
    *     mixpanel.people.increment('credits_left', -1);
    *
    *     // like mixpanel.people.set(), you can increment multiple
    *     // properties at once:
    *     mixpanel.people.increment({
    *         counter1: 1,
    *         counter2: 6
    *     });
    *
    * @param {Object|String} prop If a string, this is the name of the property. If an object, this is an associative array of names and numeric values.
    * @param {Number} [by] An amount to increment the given property
    * @param {Function} [callback] If provided, the callback will be called after tracking the event.
    */
    MixpanelPeople.prototype.increment = addOptOutCheckMixpanelPeople(function(prop, by, callback) {
        var data = {};
        var $add = {};
        if (_.isObject(prop)) {
            _.each(prop, function(v, k) {
                if (!this._is_reserved_property(k)) {
                    if (isNaN(parseFloat(v))) {
                        console$1.error('Invalid increment value passed to mixpanel.people.increment - must be a number');
                        return;
                    } else {
                        $add[k] = v;
                    }
                }
            }, this);
            callback = by;
        } else {
            // convenience: mixpanel.people.increment('property'); will
            // increment 'property' by 1
            if (_.isUndefined(by)) {
                by = 1;
            }
            $add[prop] = by;
        }
        data[ADD_ACTION] = $add;

        return this._send_request(data, callback);
    });

    /*
    * Append a value to a list-valued people analytics property.
    *
    * ### Usage:
    *
    *     // append a value to a list, creating it if needed
    *     mixpanel.people.append('pages_visited', 'homepage');
    *
    *     // like mixpanel.people.set(), you can append multiple
    *     // properties at once:
    *     mixpanel.people.append({
    *         list1: 'bob',
    *         list2: 123
    *     });
    *
    * @param {Object|String} list_name If a string, this is the name of the property. If an object, this is an associative array of names and values.
    * @param {*} [value] value An item to append to the list
    * @param {Function} [callback] If provided, the callback will be called after tracking the event.
    */
    MixpanelPeople.prototype.append = addOptOutCheckMixpanelPeople(function(list_name, value, callback) {
        if (_.isObject(list_name)) {
            callback = value;
        }
        var data = this.append_action(list_name, value);
        return this._send_request(data, callback);
    });

    /*
    * Remove a value from a list-valued people analytics property.
    *
    * ### Usage:
    *
    *     mixpanel.people.remove('School', 'UCB');
    *
    * @param {Object|String} list_name If a string, this is the name of the property. If an object, this is an associative array of names and values.
    * @param {*} [value] value Item to remove from the list
    * @param {Function} [callback] If provided, the callback will be called after tracking the event.
    */
    MixpanelPeople.prototype.remove = addOptOutCheckMixpanelPeople(function(list_name, value, callback) {
        if (_.isObject(list_name)) {
            callback = value;
        }
        var data = this.remove_action(list_name, value);
        return this._send_request(data, callback);
    });

    /*
    * Merge a given list with a list-valued people analytics property,
    * excluding duplicate values.
    *
    * ### Usage:
    *
    *     // merge a value to a list, creating it if needed
    *     mixpanel.people.union('pages_visited', 'homepage');
    *
    *     // like mixpanel.people.set(), you can append multiple
    *     // properties at once:
    *     mixpanel.people.union({
    *         list1: 'bob',
    *         list2: 123
    *     });
    *
    *     // like mixpanel.people.append(), you can append multiple
    *     // values to the same list:
    *     mixpanel.people.union({
    *         list1: ['bob', 'billy']
    *     });
    *
    * @param {Object|String} list_name If a string, this is the name of the property. If an object, this is an associative array of names and values.
    * @param {*} [value] Value / values to merge with the given property
    * @param {Function} [callback] If provided, the callback will be called after tracking the event.
    */
    MixpanelPeople.prototype.union = addOptOutCheckMixpanelPeople(function(list_name, values, callback) {
        if (_.isObject(list_name)) {
            callback = values;
        }
        var data = this.union_action(list_name, values);
        return this._send_request(data, callback);
    });

    /*
    * Record that you have charged the current user a certain amount
    * of money. Charges recorded with track_charge() will appear in the
    * Mixpanel revenue report.
    *
    * ### Usage:
    *
    *     // charge a user $50
    *     mixpanel.people.track_charge(50);
    *
    *     // charge a user $30.50 on the 2nd of january
    *     mixpanel.people.track_charge(30.50, {
    *         '$time': new Date('jan 1 2012')
    *     });
    *
    * @param {Number} amount The amount of money charged to the current user
    * @param {Object} [properties] An associative array of properties associated with the charge
    * @param {Function} [callback] If provided, the callback will be called when the server responds
    */
    MixpanelPeople.prototype.track_charge = addOptOutCheckMixpanelPeople(function(amount, properties, callback) {
        if (!_.isNumber(amount)) {
            amount = parseFloat(amount);
            if (isNaN(amount)) {
                console$1.error('Invalid value passed to mixpanel.people.track_charge - must be a number');
                return;
            }
        }

        return this.append('$transactions', _.extend({
            '$amount': amount
        }, properties), callback);
    });

    /*
    * Permanently clear all revenue report transactions from the
    * current user's people analytics profile.
    *
    * ### Usage:
    *
    *     mixpanel.people.clear_charges();
    *
    * @param {Function} [callback] If provided, the callback will be called after tracking the event.
    */
    MixpanelPeople.prototype.clear_charges = function(callback) {
        return this.set('$transactions', [], callback);
    };

    /*
    * Permanently deletes the current people analytics profile from
    * Mixpanel (using the current distinct_id).
    *
    * ### Usage:
    *
    *     // remove the all data you have stored about the current user
    *     mixpanel.people.delete_user();
    *
    */
    MixpanelPeople.prototype.delete_user = function() {
        if (!this._identify_called()) {
            console$1.error('mixpanel.people.delete_user() requires you to call identify() first');
            return;
        }
        var data = {'$delete': this._mixpanel.get_distinct_id()};
        return this._send_request(data);
    };

    MixpanelPeople.prototype.toString = function() {
        return this._mixpanel.toString() + '.people';
    };

    MixpanelPeople.prototype._send_request = function(data, callback) {
        data['$token'] = this._get_config('token');
        data['$distinct_id'] = this._mixpanel.get_distinct_id();
        var device_id = this._mixpanel.get_property('$device_id');
        var user_id = this._mixpanel.get_property('$user_id');
        var had_persisted_distinct_id = this._mixpanel.get_property('$had_persisted_distinct_id');
        if (device_id) {
            data['$device_id'] = device_id;
        }
        if (user_id) {
            data['$user_id'] = user_id;
        }
        if (had_persisted_distinct_id) {
            data['$had_persisted_distinct_id'] = had_persisted_distinct_id;
        }

        var date_encoded_data = _.encodeDates(data);

        if (!this._identify_called()) {
            this._enqueue(data);
            if (!_.isUndefined(callback)) {
                if (this._get_config('verbose')) {
                    callback({status: -1, error: null});
                } else {
                    callback(-1);
                }
            }
            return _.truncate(date_encoded_data, 255);
        }

        return this._mixpanel._track_or_batch({
            type: 'people',
            data: date_encoded_data,
            endpoint: this._get_config('api_host') + '/engage/',
            batcher: this._mixpanel.request_batchers.people
        }, callback);
    };

    MixpanelPeople.prototype._get_config = function(conf_var) {
        return this._mixpanel.get_config(conf_var);
    };

    MixpanelPeople.prototype._identify_called = function() {
        return this._mixpanel._flags.identify_called === true;
    };

    // Queue up engage operations if identify hasn't been called yet.
    MixpanelPeople.prototype._enqueue = function(data) {
        if (SET_ACTION in data) {
            this._mixpanel['persistence']._add_to_people_queue(SET_ACTION, data);
        } else if (SET_ONCE_ACTION in data) {
            this._mixpanel['persistence']._add_to_people_queue(SET_ONCE_ACTION, data);
        } else if (UNSET_ACTION in data) {
            this._mixpanel['persistence']._add_to_people_queue(UNSET_ACTION, data);
        } else if (ADD_ACTION in data) {
            this._mixpanel['persistence']._add_to_people_queue(ADD_ACTION, data);
        } else if (APPEND_ACTION in data) {
            this._mixpanel['persistence']._add_to_people_queue(APPEND_ACTION, data);
        } else if (REMOVE_ACTION in data) {
            this._mixpanel['persistence']._add_to_people_queue(REMOVE_ACTION, data);
        } else if (UNION_ACTION in data) {
            this._mixpanel['persistence']._add_to_people_queue(UNION_ACTION, data);
        } else {
            console$1.error('Invalid call to _enqueue():', data);
        }
    };

    MixpanelPeople.prototype._flush_one_queue = function(action, action_method, callback, queue_to_params_fn) {
        var _this = this;
        var queued_data = _.extend({}, this._mixpanel['persistence']._get_queue(action));
        var action_params = queued_data;

        if (!_.isUndefined(queued_data) && _.isObject(queued_data) && !_.isEmptyObject(queued_data)) {
            _this._mixpanel['persistence']._pop_from_people_queue(action, queued_data);
            if (queue_to_params_fn) {
                action_params = queue_to_params_fn(queued_data);
            }
            action_method.call(_this, action_params, function(response, data) {
                // on bad response, we want to add it back to the queue
                if (response === 0) {
                    _this._mixpanel['persistence']._add_to_people_queue(action, queued_data);
                }
                if (!_.isUndefined(callback)) {
                    callback(response, data);
                }
            });
        }
    };

    // Flush queued engage operations - order does not matter,
    // and there are network level race conditions anyway
    MixpanelPeople.prototype._flush = function(
        _set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback, _unset_callback, _remove_callback
    ) {
        var _this = this;
        var $append_queue = this._mixpanel['persistence']._get_queue(APPEND_ACTION);
        var $remove_queue = this._mixpanel['persistence']._get_queue(REMOVE_ACTION);

        this._flush_one_queue(SET_ACTION, this.set, _set_callback);
        this._flush_one_queue(SET_ONCE_ACTION, this.set_once, _set_once_callback);
        this._flush_one_queue(UNSET_ACTION, this.unset, _unset_callback, function(queue) { return _.keys(queue); });
        this._flush_one_queue(ADD_ACTION, this.increment, _add_callback);
        this._flush_one_queue(UNION_ACTION, this.union, _union_callback);

        // we have to fire off each $append individually since there is
        // no concat method server side
        if (!_.isUndefined($append_queue) && _.isArray($append_queue) && $append_queue.length) {
            var $append_item;
            var append_callback = function(response, data) {
                if (response === 0) {
                    _this._mixpanel['persistence']._add_to_people_queue(APPEND_ACTION, $append_item);
                }
                if (!_.isUndefined(_append_callback)) {
                    _append_callback(response, data);
                }
            };
            for (var i = $append_queue.length - 1; i >= 0; i--) {
                $append_item = $append_queue.pop();
                if (!_.isEmptyObject($append_item)) {
                    _this.append($append_item, append_callback);
                }
            }
            // Save the shortened append queue
            _this._mixpanel['persistence'].save();
        }

        // same for $remove
        if (!_.isUndefined($remove_queue) && _.isArray($remove_queue) && $remove_queue.length) {
            var $remove_item;
            var remove_callback = function(response, data) {
                if (response === 0) {
                    _this._mixpanel['persistence']._add_to_people_queue(REMOVE_ACTION, $remove_item);
                }
                if (!_.isUndefined(_remove_callback)) {
                    _remove_callback(response, data);
                }
            };
            for (var j = $remove_queue.length - 1; j >= 0; j--) {
                $remove_item = $remove_queue.pop();
                if (!_.isEmptyObject($remove_item)) {
                    _this.remove($remove_item, remove_callback);
                }
            }
            _this._mixpanel['persistence'].save();
        }
    };

    MixpanelPeople.prototype._is_reserved_property = function(prop) {
        return prop === '$distinct_id' || prop === '$token' || prop === '$device_id' || prop === '$user_id' || prop === '$had_persisted_distinct_id';
    };

    // MixpanelPeople Exports
    MixpanelPeople.prototype['set']           = MixpanelPeople.prototype.set;
    MixpanelPeople.prototype['set_once']      = MixpanelPeople.prototype.set_once;
    MixpanelPeople.prototype['unset']         = MixpanelPeople.prototype.unset;
    MixpanelPeople.prototype['increment']     = MixpanelPeople.prototype.increment;
    MixpanelPeople.prototype['append']        = MixpanelPeople.prototype.append;
    MixpanelPeople.prototype['remove']        = MixpanelPeople.prototype.remove;
    MixpanelPeople.prototype['union']         = MixpanelPeople.prototype.union;
    MixpanelPeople.prototype['track_charge']  = MixpanelPeople.prototype.track_charge;
    MixpanelPeople.prototype['clear_charges'] = MixpanelPeople.prototype.clear_charges;
    MixpanelPeople.prototype['delete_user']   = MixpanelPeople.prototype.delete_user;
    MixpanelPeople.prototype['toString']      = MixpanelPeople.prototype.toString;

    /*
     * Mixpanel JS Library
     *
     * Copyright 2012, Mixpanel, Inc. All Rights Reserved
     * http://mixpanel.com/
     *
     * Includes portions of Underscore.js
     * http://documentcloud.github.com/underscore/
     * (c) 2011 Jeremy Ashkenas, DocumentCloud Inc.
     * Released under the MIT License.
     */

    // ==ClosureCompiler==
    // @compilation_level ADVANCED_OPTIMIZATIONS
    // @output_file_name mixpanel-2.8.min.js
    // ==/ClosureCompiler==

    /*
    SIMPLE STYLE GUIDE:

    this.x === public function
    this._x === internal - only use within this file
    this.__x === private - only use within the class

    Globals should be all caps
    */

    var init_type;       // MODULE or SNIPPET loader
    var mixpanel_master; // main mixpanel instance / object
    var INIT_MODULE  = 0;
    var INIT_SNIPPET = 1;

    var IDENTITY_FUNC = function(x) {return x;};
    var NOOP_FUNC = function() {};

    /** @const */ var PRIMARY_INSTANCE_NAME = 'mixpanel';


    /*
     * Dynamic... constants? Is that an oxymoron?
     */
    // http://hacks.mozilla.org/2009/07/cross-site-xmlhttprequest-with-cors/
    // https://developer.mozilla.org/en-US/docs/DOM/XMLHttpRequest#withCredentials
    var USE_XHR = (window$1.XMLHttpRequest && 'withCredentials' in new XMLHttpRequest());

    // IE<10 does not support cross-origin XHR's but script tags
    // with defer won't block window.onload; ENQUEUE_REQUESTS
    // should only be true for Opera<12
    var ENQUEUE_REQUESTS = !USE_XHR && (userAgent.indexOf('MSIE') === -1) && (userAgent.indexOf('Mozilla') === -1);

    // save reference to navigator.sendBeacon so it can be minified
    var sendBeacon = null;
    if (navigator$1['sendBeacon']) {
        sendBeacon = function() {
            // late reference to navigator.sendBeacon to allow patching/spying
            return navigator$1['sendBeacon'].apply(navigator$1, arguments);
        };
    }

    /*
     * Module-level globals
     */
    var DEFAULT_CONFIG = {
        'api_host':                          'https://api-js.mixpanel.com',
        'api_method':                        'POST',
        'api_transport':                     'XHR',
        'app_host':                          'https://mixpanel.com',
        'cdn':                               'https://cdn.mxpnl.com',
        'cross_site_cookie':                 false,
        'cross_subdomain_cookie':            true,
        'persistence':                       'cookie',
        'persistence_name':                  '',
        'cookie_domain':                     '',
        'cookie_name':                       '',
        'loaded':                            NOOP_FUNC,
        'store_google':                      true,
        'save_referrer':                     true,
        'test':                              false,
        'verbose':                           false,
        'img':                               false,
        'debug':                             false,
        'track_links_timeout':               300,
        'cookie_expiration':                 365,
        'upgrade':                           false,
        'disable_persistence':               false,
        'disable_cookie':                    false,
        'secure_cookie':                     false,
        'ip':                                true,
        'opt_out_tracking_by_default':       false,
        'opt_out_persistence_by_default':    false,
        'opt_out_tracking_persistence_type': 'localStorage',
        'opt_out_tracking_cookie_prefix':    null,
        'property_blacklist':                [],
        'xhr_headers':                       {}, // { header: value, header2: value }
        'inapp_protocol':                    '//',
        'inapp_link_new_window':             false,
        'ignore_dnt':                        false,
        'batch_requests':                    false, // for now
        'batch_size':                        50,
        'batch_flush_interval_ms':           5000,
        'batch_request_timeout_ms':          90000,
        'batch_autostart':                   true,
        'hooks':                             {}
    };

    var DOM_LOADED = false;

    /**
     * Mixpanel Library Object
     * @constructor
     */
    var MixpanelLib = function() {};


    /**
     * create_mplib(token:string, config:object, name:string)
     *
     * This function is used by the init method of MixpanelLib objects
     * as well as the main initializer at the end of the JSLib (that
     * initializes document.mixpanel as well as any additional instances
     * declared before this file has loaded).
     */
    var create_mplib = function(token, config, name) {
        var instance,
            target = (name === PRIMARY_INSTANCE_NAME) ? mixpanel_master : mixpanel_master[name];

        if (target && init_type === INIT_MODULE) {
            instance = target;
        } else {
            if (target && !_.isArray(target)) {
                console$1.error('You have already initialized ' + name);
                return;
            }
            instance = new MixpanelLib();
        }

        instance._cached_groups = {}; // cache groups in a pool
        instance._user_decide_check_complete = false;
        instance._events_tracked_before_user_decide_check_complete = [];

        instance._init(token, config, name);

        instance['people'] = new MixpanelPeople();
        instance['people']._init(instance);

        // if any instance on the page has debug = true, we set the
        // global debug to be true
        Config.DEBUG = Config.DEBUG || instance.get_config('debug');

        // if target is not defined, we called init after the lib already
        // loaded, so there won't be an array of things to execute
        if (!_.isUndefined(target) && _.isArray(target)) {
            // Crunch through the people queue first - we queue this data up &
            // flush on identify, so it's better to do all these operations first
            instance._execute_array.call(instance['people'], target['people']);
            instance._execute_array(target);
        }

        return instance;
    };

    var encode_data_for_request = function(data) {
        var json_data = _.JSONEncode(data);
        var encoded_data = _.base64Encode(json_data);
        return {'data': encoded_data};
    };

    // Initialization methods

    /**
     * This function initializes a new instance of the Mixpanel tracking object.
     * All new instances are added to the main mixpanel object as sub properties (such as
     * mixpanel.library_name) and also returned by this function. To define a
     * second instance on the page, you would call:
     *
     *     mixpanel.init('new token', { your: 'config' }, 'library_name');
     *
     * and use it like so:
     *
     *     mixpanel.library_name.track(...);
     *
     * @param {String} token   Your Mixpanel API token
     * @param {Object} [config]  A dictionary of config options to override. <a href="https://github.com/mixpanel/mixpanel-js/blob/8b2e1f7b/src/mixpanel-core.js#L87-L110">See a list of default config options</a>.
     * @param {String} [name]    The name for the new mixpanel instance that you want created
     */
    MixpanelLib.prototype.init = function (token, config, name) {
        if (_.isUndefined(name)) {
            console$1.error('You must name your new library: init(token, config, name)');
            return;
        }
        if (name === PRIMARY_INSTANCE_NAME) {
            console$1.error('You must initialize the main mixpanel object right after you include the Mixpanel js snippet');
            return;
        }

        var instance = create_mplib(token, config, name);
        mixpanel_master[name] = instance;
        instance._loaded();

        return instance;
    };

    // mixpanel._init(token:string, config:object, name:string)
    //
    // This function sets up the current instance of the mixpanel
    // library.  The difference between this method and the init(...)
    // method is this one initializes the actual instance, whereas the
    // init(...) method sets up a new library and calls _init on it.
    //
    MixpanelLib.prototype._init = function(token, config, name) {
        config = config || {};

        this['__loaded'] = true;
        this['config'] = {};
        this['_triggered_notifs'] = [];

        // rollout: enable batch_requests by default for 60% of projects
        // (only if they have not specified a value in their init config
        // and they aren't using a custom API host)
        var variable_features = {};
        var api_host = config['api_host'];
        var is_custom_api = !!api_host && !api_host.match(/\.mixpanel\.com$/);
        if (!('batch_requests' in config) && !is_custom_api && determine_eligibility(token, 'batch', 60)) {
            variable_features['batch_requests'] = true;
        }

        this.set_config(_.extend({}, DEFAULT_CONFIG, variable_features, config, {
            'name': name,
            'token': token,
            'callback_fn': ((name === PRIMARY_INSTANCE_NAME) ? name : PRIMARY_INSTANCE_NAME + '.' + name) + '._jsc'
        }));

        this['_jsc'] = NOOP_FUNC;

        this.__dom_loaded_queue = [];
        this.__request_queue = [];
        this.__disabled_events = [];
        this._flags = {
            'disable_all_events': false,
            'identify_called': false
        };

        // set up request queueing/batching
        this.request_batchers = {};
        this._batch_requests = this.get_config('batch_requests');
        if (this._batch_requests) {
            if (!_.localStorage.is_supported(true) || !USE_XHR) {
                this._batch_requests = false;
                console$1.log('Turning off Mixpanel request-queueing; needs XHR and localStorage support');
            } else {
                this.init_batchers();
                if (sendBeacon && window$1.addEventListener) {
                    window$1.addEventListener('unload', _.bind(function() {
                        // Before page closes, attempt to flush any events queued up via navigator.sendBeacon.
                        // Since sendBeacon doesn't report success/failure, events will not be removed from
                        // the persistent store; if the site is loaded again, the events will be flushed again
                        // on startup and deduplicated on the Mixpanel server side.
                        if (!this.request_batchers.events.stopped) {
                            this.request_batchers.events.flush({unloading: true});
                        }
                    }, this));
                }
            }
        }

        this['persistence'] = this['cookie'] = new MixpanelPersistence(this['config']);
        this.unpersisted_superprops = {};
        this._gdpr_init();

        var uuid = _.UUID();
        if (!this.get_distinct_id()) {
            // There is no need to set the distinct id
            // or the device id if something was already stored
            // in the persitence
            this.register_once({
                'distinct_id': uuid,
                '$device_id': uuid
            }, '');
        }
    };

    // Private methods

    MixpanelLib.prototype._loaded = function() {
        this.get_config('loaded')(this);
        this._set_default_superprops();
    };

    // update persistence with info on referrer, UTM params, etc
    MixpanelLib.prototype._set_default_superprops = function() {
        this['persistence'].update_search_keyword(document$1.referrer);
        if (this.get_config('store_google')) {
            this['persistence'].update_campaign_params();
        }
        if (this.get_config('save_referrer')) {
            this['persistence'].update_referrer_info(document$1.referrer);
        }
    };

    MixpanelLib.prototype._dom_loaded = function() {
        _.each(this.__dom_loaded_queue, function(item) {
            this._track_dom.apply(this, item);
        }, this);

        if (!this.has_opted_out_tracking()) {
            _.each(this.__request_queue, function(item) {
                this._send_request.apply(this, item);
            }, this);
        }

        delete this.__dom_loaded_queue;
        delete this.__request_queue;
    };

    MixpanelLib.prototype._track_dom = function(DomClass, args) {
        if (this.get_config('img')) {
            console$1.error('You can\'t use DOM tracking functions with img = true.');
            return false;
        }

        if (!DOM_LOADED) {
            this.__dom_loaded_queue.push([DomClass, args]);
            return false;
        }

        var dt = new DomClass().init(this);
        return dt.track.apply(dt, args);
    };

    /**
     * _prepare_callback() should be called by callers of _send_request for use
     * as the callback argument.
     *
     * If there is no callback, this returns null.
     * If we are going to make XHR/XDR requests, this returns a function.
     * If we are going to use script tags, this returns a string to use as the
     * callback GET param.
     */
    MixpanelLib.prototype._prepare_callback = function(callback, data) {
        if (_.isUndefined(callback)) {
            return null;
        }

        if (USE_XHR) {
            var callback_function = function(response) {
                callback(response, data);
            };
            return callback_function;
        } else {
            // if the user gives us a callback, we store as a random
            // property on this instances jsc function and update our
            // callback string to reflect that.
            var jsc = this['_jsc'];
            var randomized_cb = '' + Math.floor(Math.random() * 100000000);
            var callback_string = this.get_config('callback_fn') + '[' + randomized_cb + ']';
            jsc[randomized_cb] = function(response) {
                delete jsc[randomized_cb];
                callback(response, data);
            };
            return callback_string;
        }
    };

    MixpanelLib.prototype._send_request = function(url, data, options, callback) {
        var succeeded = true;

        if (ENQUEUE_REQUESTS) {
            this.__request_queue.push(arguments);
            return succeeded;
        }

        var DEFAULT_OPTIONS = {
            method: this.get_config('api_method'),
            transport: this.get_config('api_transport'),
            verbose: this.get_config('verbose')
        };
        var body_data = null;

        if (!callback && (_.isFunction(options) || typeof options === 'string')) {
            callback = options;
            options = null;
        }
        options = _.extend(DEFAULT_OPTIONS, options || {});
        if (!USE_XHR) {
            options.method = 'GET';
        }
        var use_post = options.method === 'POST';
        var use_sendBeacon = sendBeacon && use_post && options.transport.toLowerCase() === 'sendbeacon';

        // needed to correctly format responses
        var verbose_mode = options.verbose;
        if (data['verbose']) { verbose_mode = true; }

        if (this.get_config('test')) { data['test'] = 1; }
        if (verbose_mode) { data['verbose'] = 1; }
        if (this.get_config('img')) { data['img'] = 1; }
        if (!USE_XHR) {
            if (callback) {
                data['callback'] = callback;
            } else if (verbose_mode || this.get_config('test')) {
                // Verbose output (from verbose mode, or an error in test mode) is a json blob,
                // which by itself is not valid javascript. Without a callback, this verbose output will
                // cause an error when returned via jsonp, so we force a no-op callback param.
                // See the ECMA script spec: http://www.ecma-international.org/ecma-262/5.1/#sec-12.4
                data['callback'] = '(function(){})';
            }
        }

        data['ip'] = this.get_config('ip')?1:0;
        data['_'] = new Date().getTime().toString();

        if (use_post) {
            body_data = 'data=' + encodeURIComponent(data['data']);
            delete data['data'];
        }

        url += '?' + _.HTTPBuildQuery(data);

        if ('img' in data) {
            var img = document$1.createElement('img');
            img.src = url;
            document$1.body.appendChild(img);
        } else if (use_sendBeacon) {
            try {
                succeeded = sendBeacon(url, body_data);
            } catch (e) {
                console$1.error(e);
                succeeded = false;
            }
            try {
                if (callback) {
                    callback(succeeded ? 1 : 0);
                }
            } catch (e) {
                console$1.error(e);
            }
        } else if (USE_XHR) {
            try {
                var req = new XMLHttpRequest();
                req.open(options.method, url, true);

                var headers = this.get_config('xhr_headers');
                if (use_post) {
                    headers['Content-Type'] = 'application/x-www-form-urlencoded';
                }
                _.each(headers, function(headerValue, headerName) {
                    req.setRequestHeader(headerName, headerValue);
                });

                if (options.timeout_ms && typeof req.timeout !== 'undefined') {
                    req.timeout = options.timeout_ms;
                    var start_time = new Date().getTime();
                }

                // send the mp_optout cookie
                // withCredentials cannot be modified until after calling .open on Android and Mobile Safari
                req.withCredentials = true;
                req.onreadystatechange = function () {
                    if (req.readyState === 4) { // XMLHttpRequest.DONE == 4, except in safari 4
                        if (req.status === 200) {
                            if (callback) {
                                if (verbose_mode) {
                                    var response;
                                    try {
                                        response = _.JSONDecode(req.responseText);
                                    } catch (e) {
                                        console$1.error(e);
                                        if (options.ignore_json_errors) {
                                            response = req.responseText;
                                        } else {
                                            return;
                                        }
                                    }
                                    callback(response);
                                } else {
                                    callback(Number(req.responseText));
                                }
                            }
                        } else {
                            var error;
                            if (
                                req.timeout &&
                                !req.status &&
                                new Date().getTime() - start_time >= req.timeout
                            ) {
                                error = 'timeout';
                            } else {
                                error = 'Bad HTTP status: ' + req.status + ' ' + req.statusText;
                            }
                            console$1.error(error);
                            if (callback) {
                                if (verbose_mode) {
                                    callback({status: 0, error: error, xhr_req: req});
                                } else {
                                    callback(0);
                                }
                            }
                        }
                    }
                };
                req.send(body_data);
            } catch (e) {
                console$1.error(e);
                succeeded = false;
            }
        } else {
            var script = document$1.createElement('script');
            script.type = 'text/javascript';
            script.async = true;
            script.defer = true;
            script.src = url;
            var s = document$1.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(script, s);
        }

        return succeeded;
    };

    /**
     * _execute_array() deals with processing any mixpanel function
     * calls that were called before the Mixpanel library were loaded
     * (and are thus stored in an array so they can be called later)
     *
     * Note: we fire off all the mixpanel function calls && user defined
     * functions BEFORE we fire off mixpanel tracking calls. This is so
     * identify/register/set_config calls can properly modify early
     * tracking calls.
     *
     * @param {Array} array
     */
    MixpanelLib.prototype._execute_array = function(array) {
        var fn_name, alias_calls = [], other_calls = [], tracking_calls = [];
        _.each(array, function(item) {
            if (item) {
                fn_name = item[0];
                if (_.isArray(fn_name)) {
                    tracking_calls.push(item); // chained call e.g. mixpanel.get_group().set()
                } else if (typeof(item) === 'function') {
                    item.call(this);
                } else if (_.isArray(item) && fn_name === 'alias') {
                    alias_calls.push(item);
                } else if (_.isArray(item) && fn_name.indexOf('track') !== -1 && typeof(this[fn_name]) === 'function') {
                    tracking_calls.push(item);
                } else {
                    other_calls.push(item);
                }
            }
        }, this);

        var execute = function(calls, context) {
            _.each(calls, function(item) {
                if (_.isArray(item[0])) {
                    // chained call
                    var caller = context;
                    _.each(item, function(call) {
                        caller = caller[call[0]].apply(caller, call.slice(1));
                    });
                } else {
                    this[item[0]].apply(this, item.slice(1));
                }
            }, context);
        };

        execute(alias_calls, this);
        execute(other_calls, this);
        execute(tracking_calls, this);
    };

    // request queueing utils

    MixpanelLib.prototype.are_batchers_initialized = function() {
        return !!this.request_batchers.events;
    };

    MixpanelLib.prototype.init_batchers = function() {
        var token = this.get_config('token');
        if (!this.are_batchers_initialized()) {
            var batcher_for = _.bind(function(attrs) {
                return new RequestBatcher(
                    '__mpq_' + token + attrs.queue_suffix,
                    {
                        libConfig: this['config'],
                        sendRequestFunc: _.bind(function(data, options, cb) {
                            this._send_request(
                                this.get_config('api_host') + attrs.endpoint,
                                encode_data_for_request(data),
                                options,
                                this._prepare_callback(cb, data)
                            );
                        }, this),
                        beforeSendHook: _.bind(function(item) {
                            return this._run_hook('before_send_' + attrs.type, item);
                        }, this)
                    }
                );
            }, this);
            this.request_batchers = {
                events: batcher_for({type: 'events', endpoint: '/track/', queue_suffix: '_ev'}),
                people: batcher_for({type: 'people', endpoint: '/engage/', queue_suffix: '_pp'}),
                groups: batcher_for({type: 'groups', endpoint: '/groups/', queue_suffix: '_gr'})
            };
        }
        if (this.get_config('batch_autostart')) {
            this.start_batch_senders();
        }
    };

    MixpanelLib.prototype.start_batch_senders = function() {
        if (this.are_batchers_initialized()) {
            this._batch_requests = true;
            _.each(this.request_batchers, function(batcher) {
                batcher.start();
            });
        }
    };

    MixpanelLib.prototype.stop_batch_senders = function() {
        this._batch_requests = false;
        _.each(this.request_batchers, function(batcher) {
            batcher.stop();
            batcher.clear();
        });
    };

    /**
     * push() keeps the standard async-array-push
     * behavior around after the lib is loaded.
     * This is only useful for external integrations that
     * do not wish to rely on our convenience methods
     * (created in the snippet).
     *
     * ### Usage:
     *     mixpanel.push(['register', { a: 'b' }]);
     *
     * @param {Array} item A [function_name, args...] array to be executed
     */
    MixpanelLib.prototype.push = function(item) {
        this._execute_array([item]);
    };

    /**
     * Disable events on the Mixpanel object. If passed no arguments,
     * this function disables tracking of any event. If passed an
     * array of event names, those events will be disabled, but other
     * events will continue to be tracked.
     *
     * Note: this function does not stop other mixpanel functions from
     * firing, such as register() or people.set().
     *
     * @param {Array} [events] An array of event names to disable
     */
    MixpanelLib.prototype.disable = function(events) {
        if (typeof(events) === 'undefined') {
            this._flags.disable_all_events = true;
        } else {
            this.__disabled_events = this.__disabled_events.concat(events);
        }
    };

    // internal method for handling track vs batch-enqueue logic
    MixpanelLib.prototype._track_or_batch = function(options, callback) {
        var truncated_data = _.truncate(options.data, 255);
        var endpoint = options.endpoint;
        var batcher = options.batcher;
        var should_send_immediately = options.should_send_immediately;
        var send_request_options = options.send_request_options || {};
        callback = callback || NOOP_FUNC;

        var request_enqueued_or_initiated = true;
        var send_request_immediately = _.bind(function() {
            if (!send_request_options.skip_hooks) {
                truncated_data = this._run_hook('before_send_' + options.type, truncated_data);
            }
            if (truncated_data) {
                console$1.log('MIXPANEL REQUEST:');
                console$1.log(truncated_data);
                return this._send_request(
                    endpoint,
                    encode_data_for_request(truncated_data),
                    send_request_options,
                    this._prepare_callback(callback, truncated_data)
                );
            } else {
                return null;
            }
        }, this);

        if (this._batch_requests && !should_send_immediately) {
            batcher.enqueue(truncated_data, function(succeeded) {
                if (succeeded) {
                    callback(1, truncated_data);
                } else {
                    send_request_immediately();
                }
            });
        } else {
            request_enqueued_or_initiated = send_request_immediately();
        }

        return request_enqueued_or_initiated && truncated_data;
    };

    /**
     * Track an event. This is the most important and
     * frequently used Mixpanel function.
     *
     * ### Usage:
     *
     *     // track an event named 'Registered'
     *     mixpanel.track('Registered', {'Gender': 'Male', 'Age': 21});
     *
     *     // track an event using navigator.sendBeacon
     *     mixpanel.track('Left page', {'duration_seconds': 35}, {transport: 'sendBeacon'});
     *
     * To track link clicks or form submissions, see track_links() or track_forms().
     *
     * @param {String} event_name The name of the event. This can be anything the user does - 'Button Click', 'Sign Up', 'Item Purchased', etc.
     * @param {Object} [properties] A set of properties to include with the event you're sending. These describe the user who did the event or details about the event itself.
     * @param {Object} [options] Optional configuration for this track request.
     * @param {String} [options.transport] Transport method for network request ('xhr' or 'sendBeacon').
     * @param {Boolean} [options.send_immediately] Whether to bypass batching/queueing and send track request immediately.
     * @param {Function} [callback] If provided, the callback function will be called after tracking the event.
     * @returns {Boolean|Object} If the tracking request was successfully initiated/queued, an object
     * with the tracking payload sent to the API server is returned; otherwise false.
     */
    MixpanelLib.prototype.track = addOptOutCheckMixpanelLib(function(event_name, properties, options, callback) {
        if (!callback && typeof options === 'function') {
            callback = options;
            options = null;
        }
        options = options || {};
        var transport = options['transport']; // external API, don't minify 'transport' prop
        if (transport) {
            options.transport = transport; // 'transport' prop name can be minified internally
        }
        var should_send_immediately = options['send_immediately'];
        if (typeof callback !== 'function') {
            callback = NOOP_FUNC;
        }

        if (_.isUndefined(event_name)) {
            console$1.error('No event name provided to mixpanel.track');
            return;
        }

        if (this._event_is_disabled(event_name)) {
            callback(0);
            return;
        }

        // set defaults
        properties = properties || {};
        properties['token'] = this.get_config('token');

        // set $duration if time_event was previously called for this event
        var start_timestamp = this['persistence'].remove_event_timer(event_name);
        if (!_.isUndefined(start_timestamp)) {
            var duration_in_ms = new Date().getTime() - start_timestamp;
            properties['$duration'] = parseFloat((duration_in_ms / 1000).toFixed(3));
        }

        this._set_default_superprops();

        // note: extend writes to the first object, so lets make sure we
        // don't write to the persistence properties object and info
        // properties object by passing in a new object

        // update properties with pageview info and super-properties
        properties = _.extend(
            {},
            _.info.properties(),
            this['persistence'].properties(),
            this.unpersisted_superprops,
            properties
        );

        var property_blacklist = this.get_config('property_blacklist');
        if (_.isArray(property_blacklist)) {
            _.each(property_blacklist, function(blacklisted_prop) {
                delete properties[blacklisted_prop];
            });
        } else {
            console$1.error('Invalid value for property_blacklist config: ' + property_blacklist);
        }

        var data = {
            'event': event_name,
            'properties': properties
        };
        var ret = this._track_or_batch({
            type: 'events',
            data: data,
            endpoint: this.get_config('api_host') + '/track/',
            batcher: this.request_batchers.events,
            should_send_immediately: should_send_immediately,
            send_request_options: options
        }, callback);

        this._check_and_handle_triggered_notifications(data);

        return ret;
    });

    /**
     * Register the current user into one/many groups.
     *
     * ### Usage:
     *
     *      mixpanel.set_group('company', ['mixpanel', 'google']) // an array of IDs
     *      mixpanel.set_group('company', 'mixpanel')
     *      mixpanel.set_group('company', 128746312)
     *
     * @param {String} group_key Group key
     * @param {Array|String|Number} group_ids An array of group IDs, or a singular group ID
     * @param {Function} [callback] If provided, the callback will be called after tracking the event.
     *
     */
    MixpanelLib.prototype.set_group = addOptOutCheckMixpanelLib(function(group_key, group_ids, callback) {
        if (!_.isArray(group_ids)) {
            group_ids = [group_ids];
        }
        var prop = {};
        prop[group_key] = group_ids;
        this.register(prop);
        return this['people'].set(group_key, group_ids, callback);
    });

    /**
     * Add a new group for this user.
     *
     * ### Usage:
     *
     *      mixpanel.add_group('company', 'mixpanel')
     *
     * @param {String} group_key Group key
     * @param {*} group_id A valid Mixpanel property type
     * @param {Function} [callback] If provided, the callback will be called after tracking the event.
     */
    MixpanelLib.prototype.add_group = addOptOutCheckMixpanelLib(function(group_key, group_id, callback) {
        var old_values = this.get_property(group_key);
        if (old_values === undefined) {
            var prop = {};
            prop[group_key] = [group_id];
            this.register(prop);
        } else {
            if (old_values.indexOf(group_id) === -1) {
                old_values.push(group_id);
                this.register(prop);
            }
        }
        return this['people'].union(group_key, group_id, callback);
    });

    /**
     * Remove a group from this user.
     *
     * ### Usage:
     *
     *      mixpanel.remove_group('company', 'mixpanel')
     *
     * @param {String} group_key Group key
     * @param {*} group_id A valid Mixpanel property type
     * @param {Function} [callback] If provided, the callback will be called after tracking the event.
     */
    MixpanelLib.prototype.remove_group = addOptOutCheckMixpanelLib(function(group_key, group_id, callback) {
        var old_value = this.get_property(group_key);
        // if the value doesn't exist, the persistent store is unchanged
        if (old_value !== undefined) {
            var idx = old_value.indexOf(group_id);
            if (idx > -1) {
                old_value.splice(idx, 1);
                this.register({group_key: old_value});
            }
            if (old_value.length === 0) {
                this.unregister(group_key);
            }
        }
        return this['people'].remove(group_key, group_id, callback);
    });

    /**
     * Track an event with specific groups.
     *
     * ### Usage:
     *
     *      mixpanel.track_with_groups('purchase', {'product': 'iphone'}, {'University': ['UCB', 'UCLA']})
     *
     * @param {String} event_name The name of the event (see `mixpanel.track()`)
     * @param {Object=} properties A set of properties to include with the event you're sending (see `mixpanel.track()`)
     * @param {Object=} groups An object mapping group name keys to one or more values
     * @param {Function} [callback] If provided, the callback will be called after tracking the event.
     */
    MixpanelLib.prototype.track_with_groups = addOptOutCheckMixpanelLib(function(event_name, properties, groups, callback) {
        var tracking_props = _.extend({}, properties || {});
        _.each(groups, function(v, k) {
            if (v !== null && v !== undefined) {
                tracking_props[k] = v;
            }
        });
        return this.track(event_name, tracking_props, callback);
    });

    MixpanelLib.prototype._create_map_key = function (group_key, group_id) {
        return group_key + '_' + JSON.stringify(group_id);
    };

    MixpanelLib.prototype._remove_group_from_cache = function (group_key, group_id) {
        delete this._cached_groups[this._create_map_key(group_key, group_id)];
    };

    /**
     * Look up reference to a Mixpanel group
     *
     * ### Usage:
     *
     *       mixpanel.get_group(group_key, group_id)
     *
     * @param {String} group_key Group key
     * @param {Object} group_id A valid Mixpanel property type
     * @returns {Object} A MixpanelGroup identifier
     */
    MixpanelLib.prototype.get_group = function (group_key, group_id) {
        var map_key = this._create_map_key(group_key, group_id);
        var group = this._cached_groups[map_key];
        if (group === undefined || group._group_key !== group_key || group._group_id !== group_id) {
            group = new MixpanelGroup();
            group._init(this, group_key, group_id);
            this._cached_groups[map_key] = group;
        }
        return group;
    };

    /**
     * Track mp_page_view event. This is now ignored by the server.
     *
     * @param {String} [page] The url of the page to record. If you don't include this, it defaults to the current url.
     * @deprecated
     */
    MixpanelLib.prototype.track_pageview = function(page) {
        if (_.isUndefined(page)) {
            page = document$1.location.href;
        }
        this.track('mp_page_view', _.info.pageviewInfo(page));
    };

    /**
     * Track clicks on a set of document elements. Selector must be a
     * valid query. Elements must exist on the page at the time track_links is called.
     *
     * ### Usage:
     *
     *     // track click for link id #nav
     *     mixpanel.track_links('#nav', 'Clicked Nav Link');
     *
     * ### Notes:
     *
     * This function will wait up to 300 ms for the Mixpanel
     * servers to respond. If they have not responded by that time
     * it will head to the link without ensuring that your event
     * has been tracked.  To configure this timeout please see the
     * set_config() documentation below.
     *
     * If you pass a function in as the properties argument, the
     * function will receive the DOMElement that triggered the
     * event as an argument.  You are expected to return an object
     * from the function; any properties defined on this object
     * will be sent to mixpanel as event properties.
     *
     * @type {Function}
     * @param {Object|String} query A valid DOM query, element or jQuery-esque list
     * @param {String} event_name The name of the event to track
     * @param {Object|Function} [properties] A properties object or function that returns a dictionary of properties when passed a DOMElement
     */
    MixpanelLib.prototype.track_links = function() {
        return this._track_dom.call(this, LinkTracker, arguments);
    };

    /**
     * Track form submissions. Selector must be a valid query.
     *
     * ### Usage:
     *
     *     // track submission for form id 'register'
     *     mixpanel.track_forms('#register', 'Created Account');
     *
     * ### Notes:
     *
     * This function will wait up to 300 ms for the mixpanel
     * servers to respond, if they have not responded by that time
     * it will head to the link without ensuring that your event
     * has been tracked.  To configure this timeout please see the
     * set_config() documentation below.
     *
     * If you pass a function in as the properties argument, the
     * function will receive the DOMElement that triggered the
     * event as an argument.  You are expected to return an object
     * from the function; any properties defined on this object
     * will be sent to mixpanel as event properties.
     *
     * @type {Function}
     * @param {Object|String} query A valid DOM query, element or jQuery-esque list
     * @param {String} event_name The name of the event to track
     * @param {Object|Function} [properties] This can be a set of properties, or a function that returns a set of properties after being passed a DOMElement
     */
    MixpanelLib.prototype.track_forms = function() {
        return this._track_dom.call(this, FormTracker, arguments);
    };

    /**
     * Time an event by including the time between this call and a
     * later 'track' call for the same event in the properties sent
     * with the event.
     *
     * ### Usage:
     *
     *     // time an event named 'Registered'
     *     mixpanel.time_event('Registered');
     *     mixpanel.track('Registered', {'Gender': 'Male', 'Age': 21});
     *
     * When called for a particular event name, the next track call for that event
     * name will include the elapsed time between the 'time_event' and 'track'
     * calls. This value is stored as seconds in the '$duration' property.
     *
     * @param {String} event_name The name of the event.
     */
    MixpanelLib.prototype.time_event = function(event_name) {
        if (_.isUndefined(event_name)) {
            console$1.error('No event name provided to mixpanel.time_event');
            return;
        }

        if (this._event_is_disabled(event_name)) {
            return;
        }

        this['persistence'].set_event_timer(event_name,  new Date().getTime());
    };

    var REGISTER_DEFAULTS = {
        'persistent': true
    };
    /**
     * Helper to parse options param for register methods, maintaining
     * legacy support for plain "days" param instead of options object
     * @param {Number|Object} [days_or_options] 'days' option (Number), or Options object for register methods
     * @returns {Object} options object
     */
    var options_for_register = function(days_or_options) {
        var options;
        if (_.isObject(days_or_options)) {
            options = days_or_options;
        } else if (!_.isUndefined(days_or_options)) {
            options = {'days': days_or_options};
        } else {
            options = {};
        }
        return _.extend({}, REGISTER_DEFAULTS, options);
    };

    /**
     * Register a set of super properties, which are included with all
     * events. This will overwrite previous super property values.
     *
     * ### Usage:
     *
     *     // register 'Gender' as a super property
     *     mixpanel.register({'Gender': 'Female'});
     *
     *     // register several super properties when a user signs up
     *     mixpanel.register({
     *         'Email': 'jdoe@example.com',
     *         'Account Type': 'Free'
     *     });
     *
     *     // register only for the current pageload
     *     mixpanel.register({'Name': 'Pat'}, {persistent: false});
     *
     * @param {Object} properties An associative array of properties to store about the user
     * @param {Number|Object} [days_or_options] Options object or number of days since the user's last visit to store the super properties (only valid for persisted props)
     * @param {boolean} [days_or_options.days] - number of days since the user's last visit to store the super properties (only valid for persisted props)
     * @param {boolean} [days_or_options.persistent=true] - whether to put in persistent storage (cookie/localStorage)
     */
    MixpanelLib.prototype.register = function(props, days_or_options) {
        var options = options_for_register(days_or_options);
        if (options['persistent']) {
            this['persistence'].register(props, options['days']);
        } else {
            _.extend(this.unpersisted_superprops, props);
        }
    };

    /**
     * Register a set of super properties only once. This will not
     * overwrite previous super property values, unlike register().
     *
     * ### Usage:
     *
     *     // register a super property for the first time only
     *     mixpanel.register_once({
     *         'First Login Date': new Date().toISOString()
     *     });
     *
     *     // register once, only for the current pageload
     *     mixpanel.register_once({
     *         'First interaction time': new Date().toISOString()
     *     }, 'None', {persistent: false});
     *
     * ### Notes:
     *
     * If default_value is specified, current super properties
     * with that value will be overwritten.
     *
     * @param {Object} properties An associative array of properties to store about the user
     * @param {*} [default_value] Value to override if already set in super properties (ex: 'False') Default: 'None'
     * @param {Number|Object} [days_or_options] Options object or number of days since the user's last visit to store the super properties (only valid for persisted props)
     * @param {boolean} [days_or_options.days] - number of days since the user's last visit to store the super properties (only valid for persisted props)
     * @param {boolean} [days_or_options.persistent=true] - whether to put in persistent storage (cookie/localStorage)
     */
    MixpanelLib.prototype.register_once = function(props, default_value, days_or_options) {
        var options = options_for_register(days_or_options);
        if (options['persistent']) {
            this['persistence'].register_once(props, default_value, options['days']);
        } else {
            if (typeof(default_value) === 'undefined') {
                default_value = 'None';
            }
            _.each(props, function(val, prop) {
                if (!this.unpersisted_superprops.hasOwnProperty(prop) || this.unpersisted_superprops[prop] === default_value) {
                    this.unpersisted_superprops[prop] = val;
                }
            }, this);
        }
    };

    /**
     * Delete a super property stored with the current user.
     *
     * @param {String} property The name of the super property to remove
     * @param {Object} [options]
     * @param {boolean} [options.persistent=true] - whether to look in persistent storage (cookie/localStorage)
     */
    MixpanelLib.prototype.unregister = function(property, options) {
        options = options_for_register(options);
        if (options['persistent']) {
            this['persistence'].unregister(property);
        } else {
            delete this.unpersisted_superprops[property];
        }
    };

    MixpanelLib.prototype._register_single = function(prop, value) {
        var props = {};
        props[prop] = value;
        this.register(props);
    };

    /**
     * Identify a user with a unique ID to track user activity across
     * devices, tie a user to their events, and create a user profile.
     * If you never call this method, unique visitors are tracked using
     * a UUID generated the first time they visit the site.
     *
     * Call identify when you know the identity of the current user,
     * typically after login or signup. We recommend against using
     * identify for anonymous visitors to your site.
     *
     * ### Notes:
     * If your project has
     * <a href="https://help.mixpanel.com/hc/en-us/articles/360039133851">ID Merge</a>
     * enabled, the identify method will connect pre- and
     * post-authentication events when appropriate.
     *
     * If your project does not have ID Merge enabled, identify will
     * change the user's local distinct_id to the unique ID you pass.
     * Events tracked prior to authentication will not be connected
     * to the same user identity. If ID Merge is disabled, alias can
     * be used to connect pre- and post-registration events.
     *
     * @param {String} [unique_id] A string that uniquely identifies a user. If not provided, the distinct_id currently in the persistent store (cookie or localStorage) will be used.
     */
    MixpanelLib.prototype.identify = function(
        new_distinct_id, _set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback, _unset_callback, _remove_callback
    ) {
        // Optional Parameters
        //  _set_callback:function  A callback to be run if and when the People set queue is flushed
        //  _add_callback:function  A callback to be run if and when the People add queue is flushed
        //  _append_callback:function  A callback to be run if and when the People append queue is flushed
        //  _set_once_callback:function  A callback to be run if and when the People set_once queue is flushed
        //  _union_callback:function  A callback to be run if and when the People union queue is flushed
        //  _unset_callback:function  A callback to be run if and when the People unset queue is flushed

        var previous_distinct_id = this.get_distinct_id();
        this.register({'$user_id': new_distinct_id});

        if (!this.get_property('$device_id')) {
            // The persisted distinct id might not actually be a device id at all
            // it might be a distinct id of the user from before
            var device_id = previous_distinct_id;
            this.register_once({
                '$had_persisted_distinct_id': true,
                '$device_id': device_id
            }, '');
        }

        // identify only changes the distinct id if it doesn't match either the existing or the alias;
        // if it's new, blow away the alias as well.
        if (new_distinct_id !== previous_distinct_id && new_distinct_id !== this.get_property(ALIAS_ID_KEY)) {
            this.unregister(ALIAS_ID_KEY);
            this.register({'distinct_id': new_distinct_id});
        }
        this._check_and_handle_notifications(this.get_distinct_id());
        this._flags.identify_called = true;
        // Flush any queued up people requests
        this['people']._flush(_set_callback, _add_callback, _append_callback, _set_once_callback, _union_callback, _unset_callback, _remove_callback);

        // send an $identify event any time the distinct_id is changing - logic on the server
        // will determine whether or not to do anything with it.
        if (new_distinct_id !== previous_distinct_id) {
            this.track('$identify', {
                'distinct_id': new_distinct_id,
                '$anon_distinct_id': previous_distinct_id
            }, {skip_hooks: true});
        }
    };

    /**
     * Clears super properties and generates a new random distinct_id for this instance.
     * Useful for clearing data when a user logs out.
     */
    MixpanelLib.prototype.reset = function() {
        this['persistence'].clear();
        this._flags.identify_called = false;
        var uuid = _.UUID();
        this.register_once({
            'distinct_id': uuid,
            '$device_id': uuid
        }, '');
    };

    /**
     * Returns the current distinct id of the user. This is either the id automatically
     * generated by the library or the id that has been passed by a call to identify().
     *
     * ### Notes:
     *
     * get_distinct_id() can only be called after the Mixpanel library has finished loading.
     * init() has a loaded function available to handle this automatically. For example:
     *
     *     // set distinct_id after the mixpanel library has loaded
     *     mixpanel.init('YOUR PROJECT TOKEN', {
     *         loaded: function(mixpanel) {
     *             distinct_id = mixpanel.get_distinct_id();
     *         }
     *     });
     */
    MixpanelLib.prototype.get_distinct_id = function() {
        return this.get_property('distinct_id');
    };

    /**
     * The alias method creates an alias which Mixpanel will use to
     * remap one id to another. Multiple aliases can point to the
     * same identifier.
     *
     * The following is a valid use of alias:
     *
     *     mixpanel.alias('new_id', 'existing_id');
     *     // You can add multiple id aliases to the existing ID
     *     mixpanel.alias('newer_id', 'existing_id');
     *
     * Aliases can also be chained - the following is a valid example:
     *
     *     mixpanel.alias('new_id', 'existing_id');
     *     // chain newer_id - new_id - existing_id
     *     mixpanel.alias('newer_id', 'new_id');
     *
     * Aliases cannot point to multiple identifiers - the following
     * example will not work:
     *
     *     mixpanel.alias('new_id', 'existing_id');
     *     // this is invalid as 'new_id' already points to 'existing_id'
     *     mixpanel.alias('new_id', 'newer_id');
     *
     * ### Notes:
     *
     * If your project does not have
     * <a href="https://help.mixpanel.com/hc/en-us/articles/360039133851">ID Merge</a>
     * enabled, the best practice is to call alias once when a unique
     * ID is first created for a user (e.g., when a user first registers
     * for an account). Do not use alias multiple times for a single
     * user without ID Merge enabled.
     *
     * @param {String} alias A unique identifier that you want to use for this user in the future.
     * @param {String} [original] The current identifier being used for this user.
     */
    MixpanelLib.prototype.alias = function(alias, original) {
        // If the $people_distinct_id key exists in persistence, there has been a previous
        // mixpanel.people.identify() call made for this user. It is VERY BAD to make an alias with
        // this ID, as it will duplicate users.
        if (alias === this.get_property(PEOPLE_DISTINCT_ID_KEY)) {
            console$1.critical('Attempting to create alias for existing People user - aborting.');
            return -2;
        }

        var _this = this;
        if (_.isUndefined(original)) {
            original = this.get_distinct_id();
        }
        if (alias !== original) {
            this._register_single(ALIAS_ID_KEY, alias);
            return this.track('$create_alias', {
                'alias': alias,
                'distinct_id': original
            }, {
                skip_hooks: true
            }, function() {
                // Flush the people queue
                _this.identify(alias);
            });
        } else {
            console$1.error('alias matches current distinct_id - skipping api call.');
            this.identify(alias);
            return -1;
        }
    };

    /**
     * Provide a string to recognize the user by. The string passed to
     * this method will appear in the Mixpanel Streams product rather
     * than an automatically generated name. Name tags do not have to
     * be unique.
     *
     * This value will only be included in Streams data.
     *
     * @param {String} name_tag A human readable name for the user
     * @deprecated
     */
    MixpanelLib.prototype.name_tag = function(name_tag) {
        this._register_single('mp_name_tag', name_tag);
    };

    /**
     * Update the configuration of a mixpanel library instance.
     *
     * The default config is:
     *
     *     {
     *       // HTTP method for tracking requests
     *       api_method: 'POST'
     *
     *       // transport for sending requests ('XHR' or 'sendBeacon')
     *       // NB: sendBeacon should only be used for scenarios such as
     *       // page unload where a "best-effort" attempt to send is
     *       // acceptable; the sendBeacon API does not support callbacks
     *       // or any way to know the result of the request. Mixpanel
     *       // tracking via sendBeacon will not support any event-
     *       // batching or retry mechanisms.
     *       api_transport: 'XHR'
     *
     *       // turn on request-batching/queueing/retry
     *       batch_requests: false,
     *
     *       // maximum number of events/updates to send in a single
     *       // network request
     *       batch_size: 50,
     *
     *       // milliseconds to wait between sending batch requests
     *       batch_flush_interval_ms: 5000,
     *
     *       // milliseconds to wait for network responses to batch requests
     *       // before they are considered timed-out and retried
     *       batch_request_timeout_ms: 90000,
     *
     *       // override value for cookie domain, only useful for ensuring
     *       // correct cross-subdomain cookies on unusual domains like
     *       // subdomain.mainsite.avocat.fr; NB this cannot be used to
     *       // set cookies on a different domain than the current origin
     *       cookie_domain: ''
     *
     *       // super properties cookie expiration (in days)
     *       cookie_expiration: 365
     *
     *       // if true, cookie will be set with SameSite=None; Secure
     *       // this is only useful in special situations, like embedded
     *       // 3rd-party iframes that set up a Mixpanel instance
     *       cross_site_cookie: false
     *
     *       // super properties span subdomains
     *       cross_subdomain_cookie: true
     *
     *       // debug mode
     *       debug: false
     *
     *       // if this is true, the mixpanel cookie or localStorage entry
     *       // will be deleted, and no user persistence will take place
     *       disable_persistence: false
     *
     *       // if this is true, Mixpanel will automatically determine
     *       // City, Region and Country data using the IP address of
     *       //the client
     *       ip: true
     *
     *       // opt users out of tracking by this Mixpanel instance by default
     *       opt_out_tracking_by_default: false
     *
     *       // opt users out of browser data storage by this Mixpanel instance by default
     *       opt_out_persistence_by_default: false
     *
     *       // persistence mechanism used by opt-in/opt-out methods - cookie
     *       // or localStorage - falls back to cookie if localStorage is unavailable
     *       opt_out_tracking_persistence_type: 'localStorage'
     *
     *       // customize the name of cookie/localStorage set by opt-in/opt-out methods
     *       opt_out_tracking_cookie_prefix: null
     *
     *       // type of persistent store for super properties (cookie/
     *       // localStorage) if set to 'localStorage', any existing
     *       // mixpanel cookie value with the same persistence_name
     *       // will be transferred to localStorage and deleted
     *       persistence: 'cookie'
     *
     *       // name for super properties persistent store
     *       persistence_name: ''
     *
     *       // names of properties/superproperties which should never
     *       // be sent with track() calls
     *       property_blacklist: []
     *
     *       // if this is true, mixpanel cookies will be marked as
     *       // secure, meaning they will only be transmitted over https
     *       secure_cookie: false
     *
     *       // the amount of time track_links will
     *       // wait for Mixpanel's servers to respond
     *       track_links_timeout: 300
     *
     *       // if you set upgrade to be true, the library will check for
     *       // a cookie from our old js library and import super
     *       // properties from it, then the old cookie is deleted
     *       // The upgrade config option only works in the initialization,
     *       // so make sure you set it when you create the library.
     *       upgrade: false
     *
     *       // extra HTTP request headers to set for each API request, in
     *       // the format {'Header-Name': value}
     *       xhr_headers: {}
     *
     *       // protocol for fetching in-app message resources, e.g.
     *       // 'https://' or 'http://'; defaults to '//' (which defers to the
     *       // current page's protocol)
     *       inapp_protocol: '//'
     *
     *       // whether to open in-app message link in new tab/window
     *       inapp_link_new_window: false
     *
     *       // whether to ignore or respect the web browser's Do Not Track setting
     *       ignore_dnt: false
     *     }
     *
     *
     * @param {Object} config A dictionary of new configuration values to update
     */
    MixpanelLib.prototype.set_config = function(config) {
        if (_.isObject(config)) {
            _.extend(this['config'], config);

            var new_batch_size = config['batch_size'];
            if (new_batch_size) {
                _.each(this.request_batchers, function(batcher) {
                    batcher.resetBatchSize();
                });
            }

            if (!this.get_config('persistence_name')) {
                this['config']['persistence_name'] = this['config']['cookie_name'];
            }
            if (!this.get_config('disable_persistence')) {
                this['config']['disable_persistence'] = this['config']['disable_cookie'];
            }

            if (this['persistence']) {
                this['persistence'].update_config(this['config']);
            }
            Config.DEBUG = Config.DEBUG || this.get_config('debug');
        }
    };

    /**
     * returns the current config object for the library.
     */
    MixpanelLib.prototype.get_config = function(prop_name) {
        return this['config'][prop_name];
    };

    /**
     * Fetch a hook function from config, with safe default, and run it
     * against the given arguments
     * @param {string} hook_name which hook to retrieve
     * @returns {any|null} return value of user-provided hook, or null if nothing was returned
     */
    MixpanelLib.prototype._run_hook = function(hook_name) {
        var ret = (this['config']['hooks'][hook_name] || IDENTITY_FUNC).apply(this, slice.call(arguments, 1));
        if (typeof ret === 'undefined') {
            console$1.error(hook_name + ' hook did not return a value');
            ret = null;
        }
        return ret;
    };

    /**
     * Returns the value of the super property named property_name. If no such
     * property is set, get_property() will return the undefined value.
     *
     * ### Notes:
     *
     * get_property() can only be called after the Mixpanel library has finished loading.
     * init() has a loaded function available to handle this automatically. For example:
     *
     *     // grab value for 'user_id' after the mixpanel library has loaded
     *     mixpanel.init('YOUR PROJECT TOKEN', {
     *         loaded: function(mixpanel) {
     *             user_id = mixpanel.get_property('user_id');
     *         }
     *     });
     *
     * @param {String} property_name The name of the super property you want to retrieve
     */
    MixpanelLib.prototype.get_property = function(property_name) {
        return this['persistence']['props'][property_name];
    };

    MixpanelLib.prototype.toString = function() {
        var name = this.get_config('name');
        if (name !== PRIMARY_INSTANCE_NAME) {
            name = PRIMARY_INSTANCE_NAME + '.' + name;
        }
        return name;
    };

    MixpanelLib.prototype._event_is_disabled = function(event_name) {
        return _.isBlockedUA(userAgent) ||
            this._flags.disable_all_events ||
            _.include(this.__disabled_events, event_name);
    };

    MixpanelLib.prototype._check_and_handle_triggered_notifications = addOptOutCheckMixpanelLib(function(event_data) {
        if (!this._user_decide_check_complete) {
            this._events_tracked_before_user_decide_check_complete.push(event_data);
        } else {
            var arr = this['_triggered_notifs'];
            for (var i = 0; i < arr.length; i++) {
                var notif = new MixpanelNotification(arr[i], this);
                if (notif._matches_event_data(event_data)) {
                    this._show_notification(arr[i]);
                    return;
                }
            }
        }
    });

    MixpanelLib.prototype._check_and_handle_notifications = addOptOutCheckMixpanelLib(function(distinct_id) {
        if (
            !distinct_id ||
            this._flags.identify_called ||
            this.get_config('disable_notifications')
        ) {
            return;
        }

        console$1.log('MIXPANEL NOTIFICATION CHECK');

        var data = {
            'verbose':     true,
            'version':     '3',
            'lib':         'web',
            'token':       this.get_config('token'),
            'distinct_id': distinct_id
        };
        this._send_request(
            this.get_config('api_host') + '/decide/',
            data,
            {method: 'GET', transport: 'XHR'},
            this._prepare_callback(_.bind(function(result) {
                if (result['notifications'] && result['notifications'].length > 0) {
                    this['_triggered_notifs'] = [];
                    var notifications = [];
                    _.each(result['notifications'], function(notif) {
                        (notif['display_triggers'] && notif['display_triggers'].length > 0 ? this['_triggered_notifs'] : notifications).push(notif);
                    }, this);
                    if (notifications.length > 0) {
                        this._show_notification.call(this, notifications[0]);
                    }
                }
                this._handle_user_decide_check_complete();
            }, this))
        );
    });

    MixpanelLib.prototype._handle_user_decide_check_complete = function() {
        this._user_decide_check_complete = true;

        // check notifications against events that were tracked before decide call completed
        var events = this._events_tracked_before_user_decide_check_complete;
        while (events.length > 0) {
            var data = events.shift(); // replay in the same order they came in
            this._check_and_handle_triggered_notifications(data);
        }
    };

    MixpanelLib.prototype._show_notification = function(notif_data) {
        var notification = new MixpanelNotification(notif_data, this);
        notification.show();
    };

    // perform some housekeeping around GDPR opt-in/out state
    MixpanelLib.prototype._gdpr_init = function() {
        var is_localStorage_requested = this.get_config('opt_out_tracking_persistence_type') === 'localStorage';

        // try to convert opt-in/out cookies to localStorage if possible
        if (is_localStorage_requested && _.localStorage.is_supported()) {
            if (!this.has_opted_in_tracking() && this.has_opted_in_tracking({'persistence_type': 'cookie'})) {
                this.opt_in_tracking({'enable_persistence': false});
            }
            if (!this.has_opted_out_tracking() && this.has_opted_out_tracking({'persistence_type': 'cookie'})) {
                this.opt_out_tracking({'clear_persistence': false});
            }
            this.clear_opt_in_out_tracking({
                'persistence_type': 'cookie',
                'enable_persistence': false
            });
        }

        // check whether the user has already opted out - if so, clear & disable persistence
        if (this.has_opted_out_tracking()) {
            this._gdpr_update_persistence({'clear_persistence': true});

        // check whether we should opt out by default
        // note: we don't clear persistence here by default since opt-out default state is often
        //       used as an initial state while GDPR information is being collected
        } else if (!this.has_opted_in_tracking() && (
            this.get_config('opt_out_tracking_by_default') || _.cookie.get('mp_optout')
        )) {
            _.cookie.remove('mp_optout');
            this.opt_out_tracking({
                'clear_persistence': this.get_config('opt_out_persistence_by_default')
            });
        }
    };

    /**
     * Enable or disable persistence based on options
     * only enable/disable if persistence is not already in this state
     * @param {boolean} [options.clear_persistence] If true, will delete all data stored by the sdk in persistence and disable it
     * @param {boolean} [options.enable_persistence] If true, will re-enable sdk persistence
     */
    MixpanelLib.prototype._gdpr_update_persistence = function(options) {
        var disabled;
        if (options && options['clear_persistence']) {
            disabled = true;
        } else if (options && options['enable_persistence']) {
            disabled = false;
        } else {
            return;
        }

        if (!this.get_config('disable_persistence') && this['persistence'].disabled !== disabled) {
            this['persistence'].set_disabled(disabled);
        }

        if (disabled) {
            _.each(this.request_batchers, function(batcher) {
                batcher.clear();
            });
        }
    };

    // call a base gdpr function after constructing the appropriate token and options args
    MixpanelLib.prototype._gdpr_call_func = function(func, options) {
        options = _.extend({
            'track': _.bind(this.track, this),
            'persistence_type': this.get_config('opt_out_tracking_persistence_type'),
            'cookie_prefix': this.get_config('opt_out_tracking_cookie_prefix'),
            'cookie_expiration': this.get_config('cookie_expiration'),
            'cross_site_cookie': this.get_config('cross_site_cookie'),
            'cross_subdomain_cookie': this.get_config('cross_subdomain_cookie'),
            'cookie_domain': this.get_config('cookie_domain'),
            'secure_cookie': this.get_config('secure_cookie'),
            'ignore_dnt': this.get_config('ignore_dnt')
        }, options);

        // check if localStorage can be used for recording opt out status, fall back to cookie if not
        if (!_.localStorage.is_supported()) {
            options['persistence_type'] = 'cookie';
        }

        return func(this.get_config('token'), {
            track: options['track'],
            trackEventName: options['track_event_name'],
            trackProperties: options['track_properties'],
            persistenceType: options['persistence_type'],
            persistencePrefix: options['cookie_prefix'],
            cookieDomain: options['cookie_domain'],
            cookieExpiration: options['cookie_expiration'],
            crossSiteCookie: options['cross_site_cookie'],
            crossSubdomainCookie: options['cross_subdomain_cookie'],
            secureCookie: options['secure_cookie'],
            ignoreDnt: options['ignore_dnt']
        });
    };

    /**
     * Opt the user in to data tracking and cookies/localstorage for this Mixpanel instance
     *
     * ### Usage
     *
     *     // opt user in
     *     mixpanel.opt_in_tracking();
     *
     *     // opt user in with specific event name, properties, cookie configuration
     *     mixpanel.opt_in_tracking({
     *         track_event_name: 'User opted in',
     *         track_event_properties: {
     *             'Email': 'jdoe@example.com'
     *         },
     *         cookie_expiration: 30,
     *         secure_cookie: true
     *     });
     *
     * @param {Object} [options] A dictionary of config options to override
     * @param {function} [options.track] Function used for tracking a Mixpanel event to record the opt-in action (default is this Mixpanel instance's track method)
     * @param {string} [options.track_event_name=$opt_in] Event name to be used for tracking the opt-in action
     * @param {Object} [options.track_properties] Set of properties to be tracked along with the opt-in action
     * @param {boolean} [options.enable_persistence=true] If true, will re-enable sdk persistence
     * @param {string} [options.persistence_type=localStorage] Persistence mechanism used - cookie or localStorage - falls back to cookie if localStorage is unavailable
     * @param {string} [options.cookie_prefix=__mp_opt_in_out] Custom prefix to be used in the cookie/localstorage name
     * @param {Number} [options.cookie_expiration] Number of days until the opt-in cookie expires (overrides value specified in this Mixpanel instance's config)
     * @param {string} [options.cookie_domain] Custom cookie domain (overrides value specified in this Mixpanel instance's config)
     * @param {boolean} [options.cross_site_cookie] Whether the opt-in cookie is set as cross-site-enabled (overrides value specified in this Mixpanel instance's config)
     * @param {boolean} [options.cross_subdomain_cookie] Whether the opt-in cookie is set as cross-subdomain or not (overrides value specified in this Mixpanel instance's config)
     * @param {boolean} [options.secure_cookie] Whether the opt-in cookie is set as secure or not (overrides value specified in this Mixpanel instance's config)
     */
    MixpanelLib.prototype.opt_in_tracking = function(options) {
        options = _.extend({
            'enable_persistence': true
        }, options);

        this._gdpr_call_func(optIn, options);
        this._gdpr_update_persistence(options);
    };

    /**
     * Opt the user out of data tracking and cookies/localstorage for this Mixpanel instance
     *
     * ### Usage
     *
     *     // opt user out
     *     mixpanel.opt_out_tracking();
     *
     *     // opt user out with different cookie configuration from Mixpanel instance
     *     mixpanel.opt_out_tracking({
     *         cookie_expiration: 30,
     *         secure_cookie: true
     *     });
     *
     * @param {Object} [options] A dictionary of config options to override
     * @param {boolean} [options.delete_user=true] If true, will delete the currently identified user's profile and clear all charges after opting the user out
     * @param {boolean} [options.clear_persistence=true] If true, will delete all data stored by the sdk in persistence
     * @param {string} [options.persistence_type=localStorage] Persistence mechanism used - cookie or localStorage - falls back to cookie if localStorage is unavailable
     * @param {string} [options.cookie_prefix=__mp_opt_in_out] Custom prefix to be used in the cookie/localstorage name
     * @param {Number} [options.cookie_expiration] Number of days until the opt-in cookie expires (overrides value specified in this Mixpanel instance's config)
     * @param {string} [options.cookie_domain] Custom cookie domain (overrides value specified in this Mixpanel instance's config)
     * @param {boolean} [options.cross_site_cookie] Whether the opt-in cookie is set as cross-site-enabled (overrides value specified in this Mixpanel instance's config)
     * @param {boolean} [options.cross_subdomain_cookie] Whether the opt-in cookie is set as cross-subdomain or not (overrides value specified in this Mixpanel instance's config)
     * @param {boolean} [options.secure_cookie] Whether the opt-in cookie is set as secure or not (overrides value specified in this Mixpanel instance's config)
     */
    MixpanelLib.prototype.opt_out_tracking = function(options) {
        options = _.extend({
            'clear_persistence': true,
            'delete_user': true
        }, options);

        // delete user and clear charges since these methods may be disabled by opt-out
        if (options['delete_user'] && this['people'] && this['people']._identify_called()) {
            this['people'].delete_user();
            this['people'].clear_charges();
        }

        this._gdpr_call_func(optOut, options);
        this._gdpr_update_persistence(options);
    };

    /**
     * Check whether the user has opted in to data tracking and cookies/localstorage for this Mixpanel instance
     *
     * ### Usage
     *
     *     var has_opted_in = mixpanel.has_opted_in_tracking();
     *     // use has_opted_in value
     *
     * @param {Object} [options] A dictionary of config options to override
     * @param {string} [options.persistence_type=localStorage] Persistence mechanism used - cookie or localStorage - falls back to cookie if localStorage is unavailable
     * @param {string} [options.cookie_prefix=__mp_opt_in_out] Custom prefix to be used in the cookie/localstorage name
     * @returns {boolean} current opt-in status
     */
    MixpanelLib.prototype.has_opted_in_tracking = function(options) {
        return this._gdpr_call_func(hasOptedIn, options);
    };

    /**
     * Check whether the user has opted out of data tracking and cookies/localstorage for this Mixpanel instance
     *
     * ### Usage
     *
     *     var has_opted_out = mixpanel.has_opted_out_tracking();
     *     // use has_opted_out value
     *
     * @param {Object} [options] A dictionary of config options to override
     * @param {string} [options.persistence_type=localStorage] Persistence mechanism used - cookie or localStorage - falls back to cookie if localStorage is unavailable
     * @param {string} [options.cookie_prefix=__mp_opt_in_out] Custom prefix to be used in the cookie/localstorage name
     * @returns {boolean} current opt-out status
     */
    MixpanelLib.prototype.has_opted_out_tracking = function(options) {
        return this._gdpr_call_func(hasOptedOut, options);
    };

    /**
     * Clear the user's opt in/out status of data tracking and cookies/localstorage for this Mixpanel instance
     *
     * ### Usage
     *
     *     // clear user's opt-in/out status
     *     mixpanel.clear_opt_in_out_tracking();
     *
     *     // clear user's opt-in/out status with specific cookie configuration - should match
     *     // configuration used when opt_in_tracking/opt_out_tracking methods were called.
     *     mixpanel.clear_opt_in_out_tracking({
     *         cookie_expiration: 30,
     *         secure_cookie: true
     *     });
     *
     * @param {Object} [options] A dictionary of config options to override
     * @param {boolean} [options.enable_persistence=true] If true, will re-enable sdk persistence
     * @param {string} [options.persistence_type=localStorage] Persistence mechanism used - cookie or localStorage - falls back to cookie if localStorage is unavailable
     * @param {string} [options.cookie_prefix=__mp_opt_in_out] Custom prefix to be used in the cookie/localstorage name
     * @param {Number} [options.cookie_expiration] Number of days until the opt-in cookie expires (overrides value specified in this Mixpanel instance's config)
     * @param {string} [options.cookie_domain] Custom cookie domain (overrides value specified in this Mixpanel instance's config)
     * @param {boolean} [options.cross_site_cookie] Whether the opt-in cookie is set as cross-site-enabled (overrides value specified in this Mixpanel instance's config)
     * @param {boolean} [options.cross_subdomain_cookie] Whether the opt-in cookie is set as cross-subdomain or not (overrides value specified in this Mixpanel instance's config)
     * @param {boolean} [options.secure_cookie] Whether the opt-in cookie is set as secure or not (overrides value specified in this Mixpanel instance's config)
     */
    MixpanelLib.prototype.clear_opt_in_out_tracking = function(options) {
        options = _.extend({
            'enable_persistence': true
        }, options);

        this._gdpr_call_func(clearOptInOut, options);
        this._gdpr_update_persistence(options);
    };

    // EXPORTS (for closure compiler)

    // MixpanelLib Exports
    MixpanelLib.prototype['init']                               = MixpanelLib.prototype.init;
    MixpanelLib.prototype['reset']                              = MixpanelLib.prototype.reset;
    MixpanelLib.prototype['disable']                            = MixpanelLib.prototype.disable;
    MixpanelLib.prototype['time_event']                         = MixpanelLib.prototype.time_event;
    MixpanelLib.prototype['track']                              = MixpanelLib.prototype.track;
    MixpanelLib.prototype['track_links']                        = MixpanelLib.prototype.track_links;
    MixpanelLib.prototype['track_forms']                        = MixpanelLib.prototype.track_forms;
    MixpanelLib.prototype['track_pageview']                     = MixpanelLib.prototype.track_pageview;
    MixpanelLib.prototype['register']                           = MixpanelLib.prototype.register;
    MixpanelLib.prototype['register_once']                      = MixpanelLib.prototype.register_once;
    MixpanelLib.prototype['unregister']                         = MixpanelLib.prototype.unregister;
    MixpanelLib.prototype['identify']                           = MixpanelLib.prototype.identify;
    MixpanelLib.prototype['alias']                              = MixpanelLib.prototype.alias;
    MixpanelLib.prototype['name_tag']                           = MixpanelLib.prototype.name_tag;
    MixpanelLib.prototype['set_config']                         = MixpanelLib.prototype.set_config;
    MixpanelLib.prototype['get_config']                         = MixpanelLib.prototype.get_config;
    MixpanelLib.prototype['get_property']                       = MixpanelLib.prototype.get_property;
    MixpanelLib.prototype['get_distinct_id']                    = MixpanelLib.prototype.get_distinct_id;
    MixpanelLib.prototype['toString']                           = MixpanelLib.prototype.toString;
    MixpanelLib.prototype['_check_and_handle_notifications']    = MixpanelLib.prototype._check_and_handle_notifications;
    MixpanelLib.prototype['_handle_user_decide_check_complete'] = MixpanelLib.prototype._handle_user_decide_check_complete;
    MixpanelLib.prototype['_show_notification']                 = MixpanelLib.prototype._show_notification;
    MixpanelLib.prototype['opt_out_tracking']                   = MixpanelLib.prototype.opt_out_tracking;
    MixpanelLib.prototype['opt_in_tracking']                    = MixpanelLib.prototype.opt_in_tracking;
    MixpanelLib.prototype['has_opted_out_tracking']             = MixpanelLib.prototype.has_opted_out_tracking;
    MixpanelLib.prototype['has_opted_in_tracking']              = MixpanelLib.prototype.has_opted_in_tracking;
    MixpanelLib.prototype['clear_opt_in_out_tracking']          = MixpanelLib.prototype.clear_opt_in_out_tracking;
    MixpanelLib.prototype['get_group']                          = MixpanelLib.prototype.get_group;
    MixpanelLib.prototype['set_group']                          = MixpanelLib.prototype.set_group;
    MixpanelLib.prototype['add_group']                          = MixpanelLib.prototype.add_group;
    MixpanelLib.prototype['remove_group']                       = MixpanelLib.prototype.remove_group;
    MixpanelLib.prototype['track_with_groups']                  = MixpanelLib.prototype.track_with_groups;
    MixpanelLib.prototype['start_batch_senders']                = MixpanelLib.prototype.start_batch_senders;
    MixpanelLib.prototype['stop_batch_senders']                 = MixpanelLib.prototype.stop_batch_senders;

    // MixpanelPersistence Exports
    MixpanelPersistence.prototype['properties']            = MixpanelPersistence.prototype.properties;
    MixpanelPersistence.prototype['update_search_keyword'] = MixpanelPersistence.prototype.update_search_keyword;
    MixpanelPersistence.prototype['update_referrer_info']  = MixpanelPersistence.prototype.update_referrer_info;
    MixpanelPersistence.prototype['get_cross_subdomain']   = MixpanelPersistence.prototype.get_cross_subdomain;
    MixpanelPersistence.prototype['clear']                 = MixpanelPersistence.prototype.clear;

    _.safewrap_class(MixpanelLib, ['identify', '_check_and_handle_notifications', '_show_notification']);


    var instances = {};
    var extend_mp = function() {
        // add all the sub mixpanel instances
        _.each(instances, function(instance, name) {
            if (name !== PRIMARY_INSTANCE_NAME) { mixpanel_master[name] = instance; }
        });

        // add private functions as _
        mixpanel_master['_'] = _;
    };

    var override_mp_init_func = function() {
        // we override the snippets init function to handle the case where a
        // user initializes the mixpanel library after the script loads & runs
        mixpanel_master['init'] = function(token, config, name) {
            if (name) {
                // initialize a sub library
                if (!mixpanel_master[name]) {
                    mixpanel_master[name] = instances[name] = create_mplib(token, config, name);
                    mixpanel_master[name]._loaded();
                }
                return mixpanel_master[name];
            } else {
                var instance = mixpanel_master;

                if (instances[PRIMARY_INSTANCE_NAME]) {
                    // main mixpanel lib already initialized
                    instance = instances[PRIMARY_INSTANCE_NAME];
                } else if (token) {
                    // intialize the main mixpanel lib
                    instance = create_mplib(token, config, PRIMARY_INSTANCE_NAME);
                    instance._loaded();
                    instances[PRIMARY_INSTANCE_NAME] = instance;
                }

                mixpanel_master = instance;
                if (init_type === INIT_SNIPPET) {
                    window$1[PRIMARY_INSTANCE_NAME] = mixpanel_master;
                }
                extend_mp();
            }
        };
    };

    var add_dom_loaded_handler = function() {
        // Cross browser DOM Loaded support
        function dom_loaded_handler() {
            // function flag since we only want to execute this once
            if (dom_loaded_handler.done) { return; }
            dom_loaded_handler.done = true;

            DOM_LOADED = true;
            ENQUEUE_REQUESTS = false;

            _.each(instances, function(inst) {
                inst._dom_loaded();
            });
        }

        function do_scroll_check() {
            try {
                document$1.documentElement.doScroll('left');
            } catch(e) {
                setTimeout(do_scroll_check, 1);
                return;
            }

            dom_loaded_handler();
        }

        if (document$1.addEventListener) {
            if (document$1.readyState === 'complete') {
                // safari 4 can fire the DOMContentLoaded event before loading all
                // external JS (including this file). you will see some copypasta
                // on the internet that checks for 'complete' and 'loaded', but
                // 'loaded' is an IE thing
                dom_loaded_handler();
            } else {
                document$1.addEventListener('DOMContentLoaded', dom_loaded_handler, false);
            }
        } else if (document$1.attachEvent) {
            // IE
            document$1.attachEvent('onreadystatechange', dom_loaded_handler);

            // check to make sure we arn't in a frame
            var toplevel = false;
            try {
                toplevel = window$1.frameElement === null;
            } catch(e) {
                // noop
            }

            if (document$1.documentElement.doScroll && toplevel) {
                do_scroll_check();
            }
        }

        // fallback handler, always will work
        _.register_event(window$1, 'load', dom_loaded_handler, true);
    };

    function init_as_module() {
        init_type = INIT_MODULE;
        mixpanel_master = new MixpanelLib();

        override_mp_init_func();
        mixpanel_master['init']();
        add_dom_loaded_handler();

        return mixpanel_master;
    }

    var mixpanel = init_as_module();

    var mixpanel_cjs = mixpanel;

    /**
     * Represents viewport tokens that can be applied to Framework Components
     */
    var DESIGN_VIEWPORT;
    (function (DESIGN_VIEWPORT) {
        DESIGN_VIEWPORT["mobile"] = "mobile";
        DESIGN_VIEWPORT["tablet"] = "tablet";
        DESIGN_VIEWPORT["desktop"] = "desktop";
        DESIGN_VIEWPORT["widescreen"] = "widescreen";
    })(DESIGN_VIEWPORT || (DESIGN_VIEWPORT = {}));
    const DESIGN_VIEWPORT_VALUES = Object.values(DESIGN_VIEWPORT);
    ({
        ...DESIGN_VIEWPORT,
        ...get_breakpoint_delimited(DESIGN_VIEWPORT),
    });
    // TODO: Figure out the typeof error
    function get_breakpoint_delimited(enumeration) {
        const viewport_entries = Object.values(enumeration)
            .map((value) => {
            return DESIGN_VIEWPORT_VALUES.map((viewport) => {
                const delimited = `${viewport}:${value}`;
                return [delimited, delimited];
            });
        })
            .flat(1);
        return Object.fromEntries(viewport_entries);
    }

    /**
     * Represents the tiers of alignment tokens that can be applied to Framework Components
     */
    var DESIGN_ALIGNMENT;
    (function (DESIGN_ALIGNMENT) {
        DESIGN_ALIGNMENT["center"] = "center";
        DESIGN_ALIGNMENT["stretch"] = "stretch";
    })(DESIGN_ALIGNMENT || (DESIGN_ALIGNMENT = {}));
    /**
     * Represents the tiers of alignment x-axis tokens that can be applied to Framework Components
     */
    var DESIGN_ALIGNMENT_X;
    (function (DESIGN_ALIGNMENT_X) {
        DESIGN_ALIGNMENT_X["left"] = "left";
        DESIGN_ALIGNMENT_X["center"] = "center";
        DESIGN_ALIGNMENT_X["right"] = "right";
        DESIGN_ALIGNMENT_X["stretch"] = "stretch";
    })(DESIGN_ALIGNMENT_X || (DESIGN_ALIGNMENT_X = {}));
    /**
     * Represents the tiers of alignment y-axis tokens that can be applied to Framework Components
     */
    var DESIGN_ALIGNMENT_Y;
    (function (DESIGN_ALIGNMENT_Y) {
        DESIGN_ALIGNMENT_Y["top"] = "top";
        DESIGN_ALIGNMENT_Y["center"] = "center";
        DESIGN_ALIGNMENT_Y["bottom"] = "bottom";
        DESIGN_ALIGNMENT_Y["stretch"] = "stretch";
    })(DESIGN_ALIGNMENT_Y || (DESIGN_ALIGNMENT_Y = {}));
    ({
        ...DESIGN_ALIGNMENT,
        ...get_breakpoint_delimited(DESIGN_ALIGNMENT),
    });
    ({
        ...DESIGN_ALIGNMENT_X,
        ...get_breakpoint_delimited(DESIGN_ALIGNMENT_X),
    });
    ({
        ...DESIGN_ALIGNMENT_X,
    });
    ({
        ...DESIGN_ALIGNMENT_Y,
        ...get_breakpoint_delimited(DESIGN_ALIGNMENT_Y),
    });
    ({
        ...DESIGN_ALIGNMENT_Y,
    });

    /**
     * Represents the tiers of animations tokens that can be applied to Framework Components
     */
    var DESIGN_ANIMATION;
    (function (DESIGN_ANIMATION) {
        DESIGN_ANIMATION["pulse"] = "pulse";
    })(DESIGN_ANIMATION || (DESIGN_ANIMATION = {}));
    ({ ...DESIGN_ANIMATION });

    /**
     * Represents the acceptable values for `aria-current` that can be applied to Framework Components
     */
    var ARIA_CURRENT;
    (function (ARIA_CURRENT) {
        /**
         * Represents the current date within a collection of dates.
         */
        ARIA_CURRENT["date"] = "date";
        /**
         * Represents the current location within an environment or context
         */
        ARIA_CURRENT["location"] = "location";
        /**
         * Represents the current page within a set of pages
         */
        ARIA_CURRENT["page"] = "page";
        /**
         * Represents the current step within a process
         */
        ARIA_CURRENT["step"] = "step";
        /**
         * Represents the current time within a set of times
         */
        ARIA_CURRENT["time"] = "time";
        /**
         * Represents the current item within a set
         */
        ARIA_CURRENT["true"] = "true";
    })(ARIA_CURRENT || (ARIA_CURRENT = {}));
    ({ ...ARIA_CURRENT });

    /**
     * Represents the tiers of elevation (box-shadow) tokens that can be applied to Framework Components
     */
    var DESIGN_ELEVATION;
    (function (DESIGN_ELEVATION) {
        DESIGN_ELEVATION["lowest"] = "lowest";
        DESIGN_ELEVATION["low"] = "low";
        DESIGN_ELEVATION["medium"] = "medium";
        DESIGN_ELEVATION["high"] = "high";
        DESIGN_ELEVATION["highest"] = "highest";
    })(DESIGN_ELEVATION || (DESIGN_ELEVATION = {}));
    ({ ...DESIGN_ELEVATION });

    /**
     * Represents the `object-fit` configuration tokens that can be applied to Framework Components
     */
    var DESIGN_FIT;
    (function (DESIGN_FIT) {
        DESIGN_FIT["contain"] = "contain";
        DESIGN_FIT["cover"] = "cover";
        DESIGN_FIT["fill"] = "fill";
        DESIGN_FIT["none"] = "none";
        DESIGN_FIT["scale-down"] = "scale-down";
    })(DESIGN_FIT || (DESIGN_FIT = {}));
    ({ ...DESIGN_FIT });

    /**
     * Represents viewport tokens to hide content that can be applied to Framework Components
     */
    var DESIGN_HIDDEN;
    (function (DESIGN_HIDDEN) {
        DESIGN_HIDDEN["mobile"] = "mobile";
        DESIGN_HIDDEN["tablet"] = "tablet";
        DESIGN_HIDDEN["desktop"] = "desktop";
        DESIGN_HIDDEN["widescreen"] = "widescreen";
    })(DESIGN_HIDDEN || (DESIGN_HIDDEN = {}));
    ({ ...DESIGN_HIDDEN });

    /**
     * Represents the modes of orientation tokens that can be applied to Framework Components
     */
    var DESIGN_ORIENTATION;
    (function (DESIGN_ORIENTATION) {
        DESIGN_ORIENTATION["horizontal"] = "horizontal";
        DESIGN_ORIENTATION["vertical"] = "vertical";
    })(DESIGN_ORIENTATION || (DESIGN_ORIENTATION = {}));
    /**
     * Represents the modes of horizontal-based orientation tokens that can be applied to Framework Components
     */
    var DESIGN_ORIENTATION_HORIZONTAL;
    (function (DESIGN_ORIENTATION_HORIZONTAL) {
        DESIGN_ORIENTATION_HORIZONTAL["vertical"] = "vertical";
    })(DESIGN_ORIENTATION_HORIZONTAL || (DESIGN_ORIENTATION_HORIZONTAL = {}));
    /**
     * Represents the modes of vertical-based orientation tokens that can be applied to Framework Components
     */
    var DESIGN_ORIENTATION_VERTICAL;
    (function (DESIGN_ORIENTATION_VERTICAL) {
        DESIGN_ORIENTATION_VERTICAL["horizontal"] = "horizontal";
    })(DESIGN_ORIENTATION_VERTICAL || (DESIGN_ORIENTATION_VERTICAL = {}));
    ({
        ...DESIGN_ORIENTATION,
        ...get_breakpoint_delimited(DESIGN_ORIENTATION),
    });
    ({
        ...DESIGN_ORIENTATION_HORIZONTAL,
        ...get_breakpoint_delimited(DESIGN_ORIENTATION_HORIZONTAL),
    });
    ({
        ...DESIGN_ORIENTATION_VERTICAL,
        ...get_breakpoint_delimited(DESIGN_ORIENTATION_VERTICAL),
    });

    /**
     * Represents the tiers of palettes tokens that can be applied to Framework Components
     */
    var DESIGN_PALETTE;
    (function (DESIGN_PALETTE) {
        DESIGN_PALETTE["auto"] = "auto";
        DESIGN_PALETTE["inverse"] = "inverse";
        DESIGN_PALETTE["inherit"] = "inherit";
        DESIGN_PALETTE["accent"] = "accent";
        DESIGN_PALETTE["dark"] = "dark";
        DESIGN_PALETTE["light"] = "light";
        DESIGN_PALETTE["alert"] = "alert";
        DESIGN_PALETTE["affirmative"] = "affirmative";
        DESIGN_PALETTE["negative"] = "negative";
    })(DESIGN_PALETTE || (DESIGN_PALETTE = {}));
    ({ ...DESIGN_PALETTE });

    /**
     * Represents placement tokens to show content at specific relative locations that can be applied to Framework Components
     */
    var DESIGN_PLACEMENT;
    (function (DESIGN_PLACEMENT) {
        DESIGN_PLACEMENT["top"] = "top";
        DESIGN_PLACEMENT["left"] = "left";
        DESIGN_PLACEMENT["bottom"] = "bottom";
        DESIGN_PLACEMENT["right"] = "right";
    })(DESIGN_PLACEMENT || (DESIGN_PLACEMENT = {}));
    /**
     * Represents placement tokens to show content at specific x-axis relative locations that can be applied to Framework Components
     */
    var DESIGN_PLACEMENT_X;
    (function (DESIGN_PLACEMENT_X) {
        DESIGN_PLACEMENT_X["left"] = "left";
        DESIGN_PLACEMENT_X["right"] = "right";
    })(DESIGN_PLACEMENT_X || (DESIGN_PLACEMENT_X = {}));
    /**
     * Represents placement tokens to show content at specific y-axis relative locations that can be applied to Framework Components
     */
    var DESIGN_PLACEMENT_Y;
    (function (DESIGN_PLACEMENT_Y) {
        DESIGN_PLACEMENT_Y["top"] = "top";
        DESIGN_PLACEMENT_Y["bottom"] = "bottom";
    })(DESIGN_PLACEMENT_Y || (DESIGN_PLACEMENT_Y = {}));
    /**
     * Represents placement tokens to show content at specific relative locations that can be applied to Framework Components
     */
    var DESIGN_PLACEMENT_ALIGNMENT;
    (function (DESIGN_PLACEMENT_ALIGNMENT) {
        DESIGN_PLACEMENT_ALIGNMENT["start"] = "start";
        DESIGN_PLACEMENT_ALIGNMENT["center"] = "center";
        DESIGN_PLACEMENT_ALIGNMENT["end"] = "end";
    })(DESIGN_PLACEMENT_ALIGNMENT || (DESIGN_PLACEMENT_ALIGNMENT = {}));
    ({ ...DESIGN_PLACEMENT });
    ({ ...DESIGN_PLACEMENT_X });
    ({ ...DESIGN_PLACEMENT_Y });

    /**
     * Represents the tiers of grid points tokens that can be applied to Framework Components
     */
    const DESIGN_POINTS = {
        "1": "1",
        "2": "2",
        "3": "3",
        "4": "4",
        "5": "5",
        "6": "6",
        "7": "7",
        "8": "8",
        "9": "9",
        "10": "10",
        "11": "11",
        "12": "12",
    };
    ({
        ...DESIGN_POINTS,
        ...get_breakpoint_delimited(DESIGN_POINTS),
    });

    /**
     * Represents the tiers of content positioning tokens that can be applied to Framework Components
     */
    var DESIGN_POSITION;
    (function (DESIGN_POSITION) {
        DESIGN_POSITION["floated"] = "floated";
        DESIGN_POSITION["raised"] = "raised";
    })(DESIGN_POSITION || (DESIGN_POSITION = {}));
    ({ ...DESIGN_POSITION });

    /**
     * Represents resizable tokens to hide content that can be applied to Framework Components
     */
    var DESIGN_RESIZEABLE;
    (function (DESIGN_RESIZEABLE) {
        DESIGN_RESIZEABLE["x"] = "x";
        DESIGN_RESIZEABLE["y"] = "y";
    })(DESIGN_RESIZEABLE || (DESIGN_RESIZEABLE = {}));
    ({ ...DESIGN_RESIZEABLE });

    /**
     * Represents the preset border radius tokens that can be applied to Framework Components
     */
    var DESIGN_SHAPE;
    (function (DESIGN_SHAPE) {
        DESIGN_SHAPE["pill"] = "pill";
        DESIGN_SHAPE["rounded"] = "rounded";
    })(DESIGN_SHAPE || (DESIGN_SHAPE = {}));
    ({ ...DESIGN_SHAPE });

    /**
     * Represents the tiers of size tokens that can be applied to Framework Components
     */
    var DESIGN_SIZE;
    (function (DESIGN_SIZE) {
        DESIGN_SIZE["tiny"] = "tiny";
        DESIGN_SIZE["small"] = "small";
        DESIGN_SIZE["medium"] = "medium";
        DESIGN_SIZE["large"] = "large";
        DESIGN_SIZE["huge"] = "huge";
    })(DESIGN_SIZE || (DESIGN_SIZE = {}));
    ({ ...DESIGN_SIZE });

    /**
     * Represents the tiers of intrinsic sizing tokens that can be applied to Framework Components
     */
    const DESIGN_INTRINSIC_SIZING = {
        auto: "auto",
        "content-fit": "content-fit",
        "content-max": "content-max",
        "content-min": "content-min",
        prose: "prose",
        stretch: "stretch",
        "25": "25",
        "viewport-25": "viewport-25",
        "33": "33",
        "viewport-33": "viewport-33",
        "50": "50",
        "viewport-50": "viewport-50",
        "66": "66",
        "viewport-66": "viewport-66",
        "75": "75",
        "viewport-75": "viewport-75",
        "100": "100",
        "viewport-100": "viewport-100",
    };
    /**
     * Represents the tiers of sizing tokens that can be applied to Framework Components
     */
    var DESIGN_SIZING;
    (function (DESIGN_SIZING) {
        DESIGN_SIZING["tiny"] = "tiny";
        DESIGN_SIZING["small"] = "small";
        DESIGN_SIZING["medium"] = "medium";
        DESIGN_SIZING["large"] = "large";
        DESIGN_SIZING["huge"] = "huge";
    })(DESIGN_SIZING || (DESIGN_SIZING = {}));
    ({
        ...DESIGN_INTRINSIC_SIZING,
        ...get_breakpoint_delimited(DESIGN_INTRINSIC_SIZING),
    });
    ({
        ...DESIGN_SIZING,
        ...get_breakpoint_delimited(DESIGN_SIZING),
    });

    /**
     * Represents the tiers of spacing tokens that can be applied to Framework Components
     */
    var DESIGN_SPACING;
    (function (DESIGN_SPACING) {
        DESIGN_SPACING["none"] = "none";
        DESIGN_SPACING["auto"] = "auto";
        DESIGN_SPACING["tiny"] = "tiny";
        DESIGN_SPACING["small"] = "small";
        DESIGN_SPACING["medium"] = "medium";
        DESIGN_SPACING["large"] = "large";
        DESIGN_SPACING["huge"] = "huge";
    })(DESIGN_SPACING || (DESIGN_SPACING = {}));
    ({
        ...DESIGN_SPACING,
        ...get_breakpoint_delimited(DESIGN_SPACING),
    });
    ({
        ...DESIGN_SPACING,
    });

    /**
     * Represents the tiers of text alignment tokens that can be applied to Framework Components
     */
    var DESIGN_TEXT_ALIGNMENT;
    (function (DESIGN_TEXT_ALIGNMENT) {
        DESIGN_TEXT_ALIGNMENT["center"] = "center";
        DESIGN_TEXT_ALIGNMENT["justify"] = "justify";
        DESIGN_TEXT_ALIGNMENT["left"] = "left";
        DESIGN_TEXT_ALIGNMENT["right"] = "right";
    })(DESIGN_TEXT_ALIGNMENT || (DESIGN_TEXT_ALIGNMENT = {}));
    var DESIGN_TEXT_TRANSFORM;
    (function (DESIGN_TEXT_TRANSFORM) {
        DESIGN_TEXT_TRANSFORM["capitalize"] = "capitalize";
        DESIGN_TEXT_TRANSFORM["lowercase"] = "lowercase";
        DESIGN_TEXT_TRANSFORM["uppercase"] = "uppercase";
    })(DESIGN_TEXT_TRANSFORM || (DESIGN_TEXT_TRANSFORM = {}));
    var DESIGN_TEXT_VARIATION;
    (function (DESIGN_TEXT_VARIATION) {
        DESIGN_TEXT_VARIATION["headline"] = "headline";
        DESIGN_TEXT_VARIATION["truncate"] = "truncate";
    })(DESIGN_TEXT_VARIATION || (DESIGN_TEXT_VARIATION = {}));
    ({
        ...DESIGN_TEXT_ALIGNMENT,
    });
    ({
        ...DESIGN_TEXT_TRANSFORM,
    });
    ({
        ...DESIGN_TEXT_VARIATION,
    });

    /**
     * Represents the tiers of filling variation tokens that can be applied to Framework Components
     */
    var DESIGN_FILL_VARIATION;
    (function (DESIGN_FILL_VARIATION) {
        DESIGN_FILL_VARIATION["block"] = "block";
        DESIGN_FILL_VARIATION["clear"] = "clear";
        DESIGN_FILL_VARIATION["flush"] = "flush";
        DESIGN_FILL_VARIATION["outline"] = "outline";
    })(DESIGN_FILL_VARIATION || (DESIGN_FILL_VARIATION = {}));
    /**
     * Represents the tiers of flex variations tokens that can be applied to Framework Components
     */
    var DESIGN_FLEX_VARIATION;
    (function (DESIGN_FLEX_VARIATION) {
        DESIGN_FLEX_VARIATION["wrap"] = "wrap";
    })(DESIGN_FLEX_VARIATION || (DESIGN_FLEX_VARIATION = {}));
    /**
     * Represents the tiers of table variations tokens that can be applied to Framework Components
     */
    var DESIGN_TABLE_VARIATION;
    (function (DESIGN_TABLE_VARIATION) {
        DESIGN_TABLE_VARIATION["borders"] = "borders";
        DESIGN_TABLE_VARIATION["stripes"] = "stripes";
    })(DESIGN_TABLE_VARIATION || (DESIGN_TABLE_VARIATION = {}));
    ({ ...DESIGN_FILL_VARIATION });
    ({ ...DESIGN_FLEX_VARIATION });
    ({ ...DESIGN_TABLE_VARIATION });

    const ATTRIBUTE_REMAP = {
        max_height: "max-height",
        min_height: "min-height",
        max_width: "max-width",
        min_width: "min-width",
        margin_x: "margin-x",
        margin_y: "margin-y",
        margin_top: "margin-top",
        margin_left: "margin-left",
        margin_bottom: "margin-bottom",
        margin_right: "margin-right",
        padding_x: "padding-x",
        padding_y: "padding-y",
        padding_top: "padding-top",
        padding_left: "padding-left",
        padding_bottom: "padding-bottom",
        padding_right: "padding-right",
        span_x: "span-x",
        span_y: "span-y",
    };
    const DATA_ATTRIBUTES = new Set([
        "height",
        "hidden",
        "max-height",
        "min-height",
        "max-width",
        "min-width",
        "margin",
        "margin-x",
        "margin-y",
        "margin-top",
        "margin-left",
        "margin-bottom",
        "margin-right",
        "padding",
        "padding-x",
        "padding-y",
        "padding-top",
        "padding-left",
        "padding-bottom",
        "padding-right",
        "width",
    ]);
    /**
     * Represents HTML attributes that can be set globally on every Svelte Component
     */
    const HTML_ATTRIBUTES = new Set([
        "class",
        "id",
        "name",
        "style",
        "sveltekit:noscroll",
        "sveltekit:prefetch",
        "tabindex",
        "title",
    ]);
    /**
     * Returns if the value is not undefined or empty string
     * @param value
     * @returns
     */
    function is_truthy(value) {
        return value !== undefined && value !== "" && value !== false;
    }
    /**
     * Returns the mapped the input [[props]] to output props, filtering out props with
     * falsy values or not matched against the input [[set]] of valid props. Also prefixes
     * attributes with the given [[prefix]] string if available
     *
     * @param props
     * @param set
     * @param prefix
     * @returns
     */
    function map_attributes(props, set, prefix = "") {
        let entries = Object.entries(props).filter((entry) => {
            var _a;
            let [attribute, value] = entry;
            attribute = (_a = ATTRIBUTE_REMAP[attribute]) !== null && _a !== void 0 ? _a : attribute;
            if (set && !set.has(attribute))
                return false;
            return Array.isArray(value) ? value.length > 0 : is_truthy(value);
        });
        entries = entries.map((entry) => {
            var _a;
            let [attribute, value] = entry;
            attribute = (_a = ATTRIBUTE_REMAP[attribute]) !== null && _a !== void 0 ? _a : attribute;
            return [
                prefix ? prefix + attribute : attribute,
                Array.isArray(value) ? value.join(" ") : value,
            ];
        });
        return Object.fromEntries(entries);
    }
    /**
     * Returns the mapped the input [[props]] to output props, wrapper around [[map_attributes]]
     * but with `aria-` prefixed to the output attribute keys
     *
     * @param props
     * @param set
     * @returns
     */
    function map_aria_attributes(props, set) {
        return map_attributes(props, set, "aria-");
    }
    /**
     * Returns the mapped the input [[props]] to output props, wrapper around [[map_attributes]]
     * but with `data-` prefixed to the output attribute keys
     *
     * @param props
     * @param set
     * @returns
     */
    function map_data_attributes(props, set) {
        return map_attributes(props, set, "data-");
    }
    /**
     * Returns the mapped input [[props]] to output props, automatically filtering for globally
     * available props like `class` or `id`
     *
     * @param props
     * @returns
     */
    function map_global_attributes(props) {
        const data_attributes = map_data_attributes(props, DATA_ATTRIBUTES);
        const html_attributes = map_attributes(props, HTML_ATTRIBUTES);
        return {
            ...html_attributes,
            ...data_attributes,
        };
    }

    /**
     * Represents the valid loading behaviors that can be applied to Framework Components
     */
    var LOADING_BEHAVIORS;
    (function (LOADING_BEHAVIORS) {
        /**
         * Represents the that Component's content is not loaded until active somehow
         */
        LOADING_BEHAVIORS["lazy"] = "lazy";
    })(LOADING_BEHAVIORS || (LOADING_BEHAVIORS = {}));
    ({ ...LOADING_BEHAVIORS });

    /* node_modules/@kahi-ui/framework/components/feedback/spinner/Spinner.svelte generated by Svelte v3.42.5 */

    const file$e = "node_modules/@kahi-ui/framework/components/feedback/spinner/Spinner.svelte";

    function create_fragment$g(ctx) {
    	let span;
    	let span_class_value;

    	let span_levels = [
    		map_global_attributes(/*$$props*/ ctx[4]),
    		{
    			class: span_class_value = "spinner " + /*_class*/ ctx[1]
    		},
    		map_data_attributes({
    			palette: /*palette*/ ctx[2],
    			size: /*size*/ ctx[3]
    		})
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			set_attributes(span, span_data);
    			add_location(span, file$e, 13, 0, 264);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			/*span_binding*/ ctx[5](span);
    		},
    		p: function update(ctx, [dirty]) {
    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				dirty & /*$$props*/ 16 && map_global_attributes(/*$$props*/ ctx[4]),
    				dirty & /*_class*/ 2 && span_class_value !== (span_class_value = "spinner " + /*_class*/ ctx[1]) && { class: span_class_value },
    				dirty & /*palette, size*/ 12 && map_data_attributes({
    					palette: /*palette*/ ctx[2],
    					size: /*size*/ ctx[3]
    				})
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			/*span_binding*/ ctx[5](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Spinner', slots, []);
    	
    	
    	
    	
    	
    	let { element = undefined } = $$props;
    	let { class: _class = "" } = $$props;
    	let { palette = undefined } = $$props;
    	let { size = undefined } = $$props;

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(1, _class = $$new_props.class);
    		if ('palette' in $$new_props) $$invalidate(2, palette = $$new_props.palette);
    		if ('size' in $$new_props) $$invalidate(3, size = $$new_props.size);
    	};

    	$$self.$capture_state = () => ({
    		map_data_attributes,
    		map_global_attributes,
    		element,
    		_class,
    		palette,
    		size
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('_class' in $$props) $$invalidate(1, _class = $$new_props._class);
    		if ('palette' in $$props) $$invalidate(2, palette = $$new_props.palette);
    		if ('size' in $$props) $$invalidate(3, size = $$new_props.size);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [element, _class, palette, size, $$props, span_binding];
    }

    class Spinner extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			element: 0,
    			class: 1,
    			palette: 2,
    			size: 3
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spinner",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get element() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get palette() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set palette(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Spinner>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Spinner>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@kahi-ui/framework/components/interactables/button/Button.svelte generated by Svelte v3.42.5 */

    const file$d = "node_modules/@kahi-ui/framework/components/interactables/button/Button.svelte";

    // (93:0) {:else}
    function create_else_block_2(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	let button_levels = [
    		map_global_attributes(/*$$props*/ ctx[13]),
    		map_data_attributes({
    			palette: /*palette*/ ctx[10],
    			size: /*size*/ ctx[11],
    			variation: /*variation*/ ctx[12]
    		}),
    		map_aria_attributes({ pressed: /*active*/ ctx[1] }),
    		map_attributes({ disabled: /*disabled*/ ctx[2] })
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (default_slot) default_slot.c();
    			set_attributes(button, button_data);
    			add_location(button, file$d, 93, 4, 2694);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (default_slot) {
    				default_slot.m(button, null);
    			}

    			if (button.autofocus) button.focus();
    			/*button_binding*/ ctx[29](button);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*click_handler_6*/ ctx[22], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				dirty & /*$$props*/ 8192 && map_global_attributes(/*$$props*/ ctx[13]),
    				dirty & /*palette, size, variation*/ 7168 && map_data_attributes({
    					palette: /*palette*/ ctx[10],
    					size: /*size*/ ctx[11],
    					variation: /*variation*/ ctx[12]
    				}),
    				dirty & /*active*/ 2 && map_aria_attributes({ pressed: /*active*/ ctx[1] }),
    				dirty & /*disabled*/ 4 && map_attributes({ disabled: /*disabled*/ ctx[2] })
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (default_slot) default_slot.d(detaching);
    			/*button_binding*/ ctx[29](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_2.name,
    		type: "else",
    		source: "(93:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (61:16) 
    function create_if_block_3$4(ctx) {
    	let if_block_anchor;

    	function select_block_type_2(ctx, dirty) {
    		if (/*type*/ ctx[3] === "reset") return create_if_block_4$4;
    		if (/*type*/ ctx[3] === "submit") return create_if_block_5$2;
    		return create_else_block_1$1;
    	}

    	let current_block_type = select_block_type_2(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type_2(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$4.name,
    		type: "if",
    		source: "(61:16) ",
    		ctx
    	});

    	return block;
    }

    // (36:15) 
    function create_if_block_1$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_2$4, create_else_block$8];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*_for*/ ctx[9] === true) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$4.name,
    		type: "if",
    		source: "(36:15) ",
    		ctx
    	});

    	return block;
    }

    // (24:0) {#if href}
    function create_if_block$9(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	let a_levels = [
    		map_global_attributes(/*$$props*/ ctx[13]),
    		{ role: "button" },
    		map_data_attributes({
    			palette: /*palette*/ ctx[10],
    			size: /*size*/ ctx[11],
    			variation: /*variation*/ ctx[12]
    		}),
    		map_aria_attributes({
    			active: /*active*/ ctx[1],
    			disabled: /*disabled*/ ctx[2]
    		}),
    		map_attributes({
    			download: /*download*/ ctx[5],
    			href: /*href*/ ctx[6],
    			rel: /*rel*/ ctx[7],
    			target: /*target*/ ctx[8]
    		})
    	];

    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$d, 24, 4, 563);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			/*a_binding*/ ctx[23](a);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*click_handler*/ ctx[16], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				dirty & /*$$props*/ 8192 && map_global_attributes(/*$$props*/ ctx[13]),
    				{ role: "button" },
    				dirty & /*palette, size, variation*/ 7168 && map_data_attributes({
    					palette: /*palette*/ ctx[10],
    					size: /*size*/ ctx[11],
    					variation: /*variation*/ ctx[12]
    				}),
    				dirty & /*active, disabled*/ 6 && map_aria_attributes({
    					active: /*active*/ ctx[1],
    					disabled: /*disabled*/ ctx[2]
    				}),
    				dirty & /*download, href, rel, target*/ 480 && map_attributes({
    					download: /*download*/ ctx[5],
    					href: /*href*/ ctx[6],
    					rel: /*rel*/ ctx[7],
    					target: /*target*/ ctx[8]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			/*a_binding*/ ctx[23](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$9.name,
    		type: "if",
    		source: "(24:0) {#if href}",
    		ctx
    	});

    	return block;
    }

    // (82:4) {:else}
    function create_else_block_1$1(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		map_global_attributes(/*$$props*/ ctx[13]),
    		{ type: "button" },
    		map_data_attributes({
    			palette: /*palette*/ ctx[10],
    			size: /*size*/ ctx[11],
    			variation: /*variation*/ ctx[12]
    		}),
    		map_aria_attributes({ pressed: /*active*/ ctx[1] }),
    		map_attributes({
    			disabled: /*disabled*/ ctx[2],
    			value: /*value*/ ctx[4]
    		})
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$d, 82, 8, 2355);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			/*input_binding_2*/ ctx[28](input);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler_5*/ ctx[21], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty & /*$$props*/ 8192 && map_global_attributes(/*$$props*/ ctx[13]),
    				{ type: "button" },
    				dirty & /*palette, size, variation*/ 7168 && map_data_attributes({
    					palette: /*palette*/ ctx[10],
    					size: /*size*/ ctx[11],
    					variation: /*variation*/ ctx[12]
    				}),
    				dirty & /*active*/ 2 && map_aria_attributes({ pressed: /*active*/ ctx[1] }),
    				dirty & /*disabled, value*/ 20 && map_attributes({
    					disabled: /*disabled*/ ctx[2],
    					value: /*value*/ ctx[4]
    				})
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_2*/ ctx[28](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1$1.name,
    		type: "else",
    		source: "(82:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (72:32) 
    function create_if_block_5$2(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		map_global_attributes(/*$$props*/ ctx[13]),
    		{ type: "submit" },
    		map_data_attributes({
    			palette: /*palette*/ ctx[10],
    			size: /*size*/ ctx[11],
    			variation: /*variation*/ ctx[12]
    		}),
    		map_aria_attributes({ pressed: /*active*/ ctx[1] }),
    		map_attributes({
    			disabled: /*disabled*/ ctx[2],
    			value: /*value*/ ctx[4]
    		})
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$d, 72, 8, 2018);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			/*input_binding_1*/ ctx[27](input);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler_4*/ ctx[20], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty & /*$$props*/ 8192 && map_global_attributes(/*$$props*/ ctx[13]),
    				{ type: "submit" },
    				dirty & /*palette, size, variation*/ 7168 && map_data_attributes({
    					palette: /*palette*/ ctx[10],
    					size: /*size*/ ctx[11],
    					variation: /*variation*/ ctx[12]
    				}),
    				dirty & /*active*/ 2 && map_aria_attributes({ pressed: /*active*/ ctx[1] }),
    				dirty & /*disabled, value*/ 20 && map_attributes({
    					disabled: /*disabled*/ ctx[2],
    					value: /*value*/ ctx[4]
    				})
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding_1*/ ctx[27](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$2.name,
    		type: "if",
    		source: "(72:32) ",
    		ctx
    	});

    	return block;
    }

    // (62:4) {#if type === "reset"}
    function create_if_block_4$4(ctx) {
    	let input;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		map_global_attributes(/*$$props*/ ctx[13]),
    		{ type: "reset" },
    		map_data_attributes({
    			palette: /*palette*/ ctx[10],
    			size: /*size*/ ctx[11],
    			variation: /*variation*/ ctx[12]
    		}),
    		map_aria_attributes({ pressed: /*active*/ ctx[1] }),
    		map_attributes({
    			disabled: /*disabled*/ ctx[2],
    			value: /*value*/ ctx[4]
    		})
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input = element("input");
    			set_attributes(input, input_data);
    			add_location(input, file$d, 62, 8, 1661);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input, anchor);
    			if (input.autofocus) input.focus();
    			/*input_binding*/ ctx[26](input);

    			if (!mounted) {
    				dispose = listen_dev(input, "click", /*click_handler_3*/ ctx[19], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				dirty & /*$$props*/ 8192 && map_global_attributes(/*$$props*/ ctx[13]),
    				{ type: "reset" },
    				dirty & /*palette, size, variation*/ 7168 && map_data_attributes({
    					palette: /*palette*/ ctx[10],
    					size: /*size*/ ctx[11],
    					variation: /*variation*/ ctx[12]
    				}),
    				dirty & /*active*/ 2 && map_aria_attributes({ pressed: /*active*/ ctx[1] }),
    				dirty & /*disabled, value*/ 20 && map_attributes({
    					disabled: /*disabled*/ ctx[2],
    					value: /*value*/ ctx[4]
    				})
    			]));
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input);
    			/*input_binding*/ ctx[26](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$4.name,
    		type: "if",
    		source: "(62:4) {#if type === \\\"reset\\\"}",
    		ctx
    	});

    	return block;
    }

    // (48:4) {:else}
    function create_else_block$8(ctx) {
    	let label;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	let label_levels = [
    		map_global_attributes(/*$$props*/ ctx[13]),
    		{ role: "button" },
    		{ for: /*_for*/ ctx[9] },
    		map_data_attributes({
    			palette: /*palette*/ ctx[10],
    			size: /*size*/ ctx[11],
    			variation: /*variation*/ ctx[12]
    		}),
    		map_aria_attributes({
    			disabled: /*disabled*/ ctx[2],
    			pressed: /*active*/ ctx[1]
    		})
    	];

    	let label_data = {};

    	for (let i = 0; i < label_levels.length; i += 1) {
    		label_data = assign(label_data, label_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (default_slot) default_slot.c();
    			set_attributes(label, label_data);
    			add_location(label, file$d, 48, 8, 1263);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			/*label_binding_1*/ ctx[25](label);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(label, "click", /*click_handler_2*/ ctx[18], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(label, label_data = get_spread_update(label_levels, [
    				dirty & /*$$props*/ 8192 && map_global_attributes(/*$$props*/ ctx[13]),
    				{ role: "button" },
    				(!current || dirty & /*_for*/ 512) && { for: /*_for*/ ctx[9] },
    				dirty & /*palette, size, variation*/ 7168 && map_data_attributes({
    					palette: /*palette*/ ctx[10],
    					size: /*size*/ ctx[11],
    					variation: /*variation*/ ctx[12]
    				}),
    				dirty & /*disabled, active*/ 6 && map_aria_attributes({
    					disabled: /*disabled*/ ctx[2],
    					pressed: /*active*/ ctx[1]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (default_slot) default_slot.d(detaching);
    			/*label_binding_1*/ ctx[25](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$8.name,
    		type: "else",
    		source: "(48:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (37:4) {#if _for === true}
    function create_if_block_2$4(ctx) {
    	let label;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[15].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[14], null);

    	let label_levels = [
    		map_global_attributes(/*$$props*/ ctx[13]),
    		{ role: "button" },
    		map_data_attributes({
    			palette: /*palette*/ ctx[10],
    			size: /*size*/ ctx[11],
    			variation: /*variation*/ ctx[12]
    		}),
    		map_aria_attributes({
    			disabled: /*disabled*/ ctx[2],
    			pressed: /*active*/ ctx[1]
    		})
    	];

    	let label_data = {};

    	for (let i = 0; i < label_levels.length; i += 1) {
    		label_data = assign(label_data, label_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			label = element("label");
    			if (default_slot) default_slot.c();
    			set_attributes(label, label_data);
    			add_location(label, file$d, 37, 8, 930);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);

    			if (default_slot) {
    				default_slot.m(label, null);
    			}

    			/*label_binding*/ ctx[24](label);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(label, "click", /*click_handler_1*/ ctx[17], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 16384)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[14],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[14])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[14], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(label, label_data = get_spread_update(label_levels, [
    				dirty & /*$$props*/ 8192 && map_global_attributes(/*$$props*/ ctx[13]),
    				{ role: "button" },
    				dirty & /*palette, size, variation*/ 7168 && map_data_attributes({
    					palette: /*palette*/ ctx[10],
    					size: /*size*/ ctx[11],
    					variation: /*variation*/ ctx[12]
    				}),
    				dirty & /*disabled, active*/ 6 && map_aria_attributes({
    					disabled: /*disabled*/ ctx[2],
    					pressed: /*active*/ ctx[1]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (default_slot) default_slot.d(detaching);
    			/*label_binding*/ ctx[24](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$4.name,
    		type: "if",
    		source: "(37:4) {#if _for === true}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$9, create_if_block_1$4, create_if_block_3$4, create_else_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*href*/ ctx[6]) return 0;
    		if (/*_for*/ ctx[9]) return 1;
    		if (/*value*/ ctx[4]) return 2;
    		return 3;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Button', slots, ['default']);
    	
    	
    	
    	
    	
    	
    	let { element = undefined } = $$props;
    	let { active = undefined } = $$props;
    	let { disabled = undefined } = $$props;
    	let { type = undefined } = $$props;
    	let { value = "" } = $$props;
    	let { download = "" } = $$props;
    	let { href = "" } = $$props;
    	let { rel = "" } = $$props;
    	let { target = "" } = $$props;
    	let { for: _for = undefined } = $$props;
    	let { palette = undefined } = $$props;
    	let { size = undefined } = $$props;
    	let { variation = undefined } = $$props;

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_2(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_3(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_4(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_5(event) {
    		bubble.call(this, $$self, event);
    	}

    	function click_handler_6(event) {
    		bubble.call(this, $$self, event);
    	}

    	function a_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function label_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function label_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function input_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function input_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function input_binding_2($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('active' in $$new_props) $$invalidate(1, active = $$new_props.active);
    		if ('disabled' in $$new_props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('type' in $$new_props) $$invalidate(3, type = $$new_props.type);
    		if ('value' in $$new_props) $$invalidate(4, value = $$new_props.value);
    		if ('download' in $$new_props) $$invalidate(5, download = $$new_props.download);
    		if ('href' in $$new_props) $$invalidate(6, href = $$new_props.href);
    		if ('rel' in $$new_props) $$invalidate(7, rel = $$new_props.rel);
    		if ('target' in $$new_props) $$invalidate(8, target = $$new_props.target);
    		if ('for' in $$new_props) $$invalidate(9, _for = $$new_props.for);
    		if ('palette' in $$new_props) $$invalidate(10, palette = $$new_props.palette);
    		if ('size' in $$new_props) $$invalidate(11, size = $$new_props.size);
    		if ('variation' in $$new_props) $$invalidate(12, variation = $$new_props.variation);
    		if ('$$scope' in $$new_props) $$invalidate(14, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		map_aria_attributes,
    		map_attributes,
    		map_data_attributes,
    		map_global_attributes,
    		element,
    		active,
    		disabled,
    		type,
    		value,
    		download,
    		href,
    		rel,
    		target,
    		_for,
    		palette,
    		size,
    		variation
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(13, $$props = assign(assign({}, $$props), $$new_props));
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('active' in $$props) $$invalidate(1, active = $$new_props.active);
    		if ('disabled' in $$props) $$invalidate(2, disabled = $$new_props.disabled);
    		if ('type' in $$props) $$invalidate(3, type = $$new_props.type);
    		if ('value' in $$props) $$invalidate(4, value = $$new_props.value);
    		if ('download' in $$props) $$invalidate(5, download = $$new_props.download);
    		if ('href' in $$props) $$invalidate(6, href = $$new_props.href);
    		if ('rel' in $$props) $$invalidate(7, rel = $$new_props.rel);
    		if ('target' in $$props) $$invalidate(8, target = $$new_props.target);
    		if ('_for' in $$props) $$invalidate(9, _for = $$new_props._for);
    		if ('palette' in $$props) $$invalidate(10, palette = $$new_props.palette);
    		if ('size' in $$props) $$invalidate(11, size = $$new_props.size);
    		if ('variation' in $$props) $$invalidate(12, variation = $$new_props.variation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		element,
    		active,
    		disabled,
    		type,
    		value,
    		download,
    		href,
    		rel,
    		target,
    		_for,
    		palette,
    		size,
    		variation,
    		$$props,
    		$$scope,
    		slots,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		a_binding,
    		label_binding,
    		label_binding_1,
    		input_binding,
    		input_binding_1,
    		input_binding_2,
    		button_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			element: 0,
    			active: 1,
    			disabled: 2,
    			type: 3,
    			value: 4,
    			download: 5,
    			href: 6,
    			rel: 7,
    			target: 8,
    			for: 9,
    			palette: 10,
    			size: 11,
    			variation: 12
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get element() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get value() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get download() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set download(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get href() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set href(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get rel() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set rel(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get target() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set target(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get for() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set for(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get palette() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set palette(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variation() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variation(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@kahi-ui/framework/components/layouts/grid/GridContainer.svelte generated by Svelte v3.42.5 */

    const file$c = "node_modules/@kahi-ui/framework/components/layouts/grid/GridContainer.svelte";

    function create_fragment$e(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	let div_levels = [
    		map_global_attributes(/*$$props*/ ctx[9]),
    		{
    			class: div_class_value = "grid " + /*_class*/ ctx[1]
    		},
    		map_data_attributes({
    			alignment: /*alignment*/ ctx[3],
    			"alignment-x": /*alignment_x*/ ctx[4],
    			"alignment-y": /*alignment_y*/ ctx[5],
    			points: /*points*/ ctx[2],
    			spacing: /*spacing*/ ctx[6],
    			"spacing-x": /*spacing_x*/ ctx[7],
    			"spacing-y": /*spacing_y*/ ctx[8]
    		})
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$c, 19, 0, 442);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[12](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$props*/ 512 && map_global_attributes(/*$$props*/ ctx[9]),
    				(!current || dirty & /*_class*/ 2 && div_class_value !== (div_class_value = "grid " + /*_class*/ ctx[1])) && { class: div_class_value },
    				dirty & /*alignment, alignment_x, alignment_y, points, spacing, spacing_x, spacing_y*/ 508 && map_data_attributes({
    					alignment: /*alignment*/ ctx[3],
    					"alignment-x": /*alignment_x*/ ctx[4],
    					"alignment-y": /*alignment_y*/ ctx[5],
    					points: /*points*/ ctx[2],
    					spacing: /*spacing*/ ctx[6],
    					"spacing-x": /*spacing_x*/ ctx[7],
    					"spacing-y": /*spacing_y*/ ctx[8]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[12](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GridContainer', slots, ['default']);
    	
    	
    	
    	
    	
    	
    	let { element = undefined } = $$props;
    	let { class: _class = "" } = $$props;
    	let { points = undefined } = $$props;
    	let { alignment = undefined } = $$props;
    	let { alignment_x = undefined } = $$props;
    	let { alignment_y = undefined } = $$props;
    	let { spacing = undefined } = $$props;
    	let { spacing_x = undefined } = $$props;
    	let { spacing_y = undefined } = $$props;

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(1, _class = $$new_props.class);
    		if ('points' in $$new_props) $$invalidate(2, points = $$new_props.points);
    		if ('alignment' in $$new_props) $$invalidate(3, alignment = $$new_props.alignment);
    		if ('alignment_x' in $$new_props) $$invalidate(4, alignment_x = $$new_props.alignment_x);
    		if ('alignment_y' in $$new_props) $$invalidate(5, alignment_y = $$new_props.alignment_y);
    		if ('spacing' in $$new_props) $$invalidate(6, spacing = $$new_props.spacing);
    		if ('spacing_x' in $$new_props) $$invalidate(7, spacing_x = $$new_props.spacing_x);
    		if ('spacing_y' in $$new_props) $$invalidate(8, spacing_y = $$new_props.spacing_y);
    		if ('$$scope' in $$new_props) $$invalidate(10, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		map_data_attributes,
    		map_global_attributes,
    		element,
    		_class,
    		points,
    		alignment,
    		alignment_x,
    		alignment_y,
    		spacing,
    		spacing_x,
    		spacing_y
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(9, $$props = assign(assign({}, $$props), $$new_props));
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('_class' in $$props) $$invalidate(1, _class = $$new_props._class);
    		if ('points' in $$props) $$invalidate(2, points = $$new_props.points);
    		if ('alignment' in $$props) $$invalidate(3, alignment = $$new_props.alignment);
    		if ('alignment_x' in $$props) $$invalidate(4, alignment_x = $$new_props.alignment_x);
    		if ('alignment_y' in $$props) $$invalidate(5, alignment_y = $$new_props.alignment_y);
    		if ('spacing' in $$props) $$invalidate(6, spacing = $$new_props.spacing);
    		if ('spacing_x' in $$props) $$invalidate(7, spacing_x = $$new_props.spacing_x);
    		if ('spacing_y' in $$props) $$invalidate(8, spacing_y = $$new_props.spacing_y);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		element,
    		_class,
    		points,
    		alignment,
    		alignment_x,
    		alignment_y,
    		spacing,
    		spacing_x,
    		spacing_y,
    		$$props,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class GridContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			element: 0,
    			class: 1,
    			points: 2,
    			alignment: 3,
    			alignment_x: 4,
    			alignment_y: 5,
    			spacing: 6,
    			spacing_x: 7,
    			spacing_y: 8
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GridContainer",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get element() {
    		throw new Error("<GridContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<GridContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<GridContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<GridContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get points() {
    		throw new Error("<GridContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set points(value) {
    		throw new Error("<GridContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alignment() {
    		throw new Error("<GridContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alignment(value) {
    		throw new Error("<GridContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alignment_x() {
    		throw new Error("<GridContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alignment_x(value) {
    		throw new Error("<GridContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alignment_y() {
    		throw new Error("<GridContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alignment_y(value) {
    		throw new Error("<GridContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing() {
    		throw new Error("<GridContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing(value) {
    		throw new Error("<GridContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing_x() {
    		throw new Error("<GridContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing_x(value) {
    		throw new Error("<GridContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing_y() {
    		throw new Error("<GridContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing_y(value) {
    		throw new Error("<GridContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@kahi-ui/framework/components/layouts/grid/GridItem.svelte generated by Svelte v3.42.5 */

    const file$b = "node_modules/@kahi-ui/framework/components/layouts/grid/GridItem.svelte";

    function create_fragment$d(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	let div_levels = [
    		map_global_attributes(/*$$props*/ ctx[5]),
    		{
    			class: div_class_value = "grid-item " + /*_class*/ ctx[1]
    		},
    		map_data_attributes({
    			span: /*span*/ ctx[2],
    			span_x: /*span_x*/ ctx[3],
    			span_y: /*span_y*/ ctx[4]
    		})
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$b, 12, 0, 290);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[8](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$props*/ 32 && map_global_attributes(/*$$props*/ ctx[5]),
    				(!current || dirty & /*_class*/ 2 && div_class_value !== (div_class_value = "grid-item " + /*_class*/ ctx[1])) && { class: div_class_value },
    				dirty & /*span, span_x, span_y*/ 28 && map_data_attributes({
    					span: /*span*/ ctx[2],
    					span_x: /*span_x*/ ctx[3],
    					span_y: /*span_y*/ ctx[4]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('GridItem', slots, ['default']);
    	
    	
    	
    	let { element = undefined } = $$props;
    	let { class: _class = "" } = $$props;
    	let { span = undefined } = $$props;
    	let { span_x = undefined } = $$props;
    	let { span_y = undefined } = $$props;

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(1, _class = $$new_props.class);
    		if ('span' in $$new_props) $$invalidate(2, span = $$new_props.span);
    		if ('span_x' in $$new_props) $$invalidate(3, span_x = $$new_props.span_x);
    		if ('span_y' in $$new_props) $$invalidate(4, span_y = $$new_props.span_y);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		map_data_attributes,
    		map_global_attributes,
    		element,
    		_class,
    		span,
    		span_x,
    		span_y
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('_class' in $$props) $$invalidate(1, _class = $$new_props._class);
    		if ('span' in $$props) $$invalidate(2, span = $$new_props.span);
    		if ('span_x' in $$props) $$invalidate(3, span_x = $$new_props.span_x);
    		if ('span_y' in $$props) $$invalidate(4, span_y = $$new_props.span_y);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [element, _class, span, span_x, span_y, $$props, $$scope, slots, div_binding];
    }

    class GridItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {
    			element: 0,
    			class: 1,
    			span: 2,
    			span_x: 3,
    			span_y: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "GridItem",
    			options,
    			id: create_fragment$d.name
    		});
    	}

    	get element() {
    		throw new Error("<GridItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<GridItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<GridItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<GridItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get span() {
    		throw new Error("<GridItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set span(value) {
    		throw new Error("<GridItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get span_x() {
    		throw new Error("<GridItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set span_x(value) {
    		throw new Error("<GridItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get span_y() {
    		throw new Error("<GridItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set span_y(value) {
    		throw new Error("<GridItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var Grid = /*#__PURE__*/Object.freeze({
        __proto__: null,
        Container: GridContainer,
        Item: GridItem
    });

    /* node_modules/@kahi-ui/framework/components/layouts/scrollable/Scrollable.svelte generated by Svelte v3.42.5 */
    const file$a = "node_modules/@kahi-ui/framework/components/layouts/scrollable/Scrollable.svelte";

    function create_fragment$c(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	let div_levels = [
    		map_global_attributes(/*$$props*/ ctx[2]),
    		{
    			class: div_class_value = "scrollable " + /*_class*/ ctx[1]
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$a, 13, 0, 209);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[5](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 8)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[3],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[3])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[3], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$props*/ 4 && map_global_attributes(/*$$props*/ ctx[2]),
    				(!current || dirty & /*_class*/ 2 && div_class_value !== (div_class_value = "scrollable " + /*_class*/ ctx[1])) && { class: div_class_value }
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[5](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Scrollable', slots, ['default']);
    	
    	
    	
    	
    	let { element = undefined } = $$props;
    	let { class: _class = "" } = $$props;

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(2, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(1, _class = $$new_props.class);
    		if ('$$scope' in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ map_global_attributes, element, _class });

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(2, $$props = assign(assign({}, $$props), $$new_props));
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('_class' in $$props) $$invalidate(1, _class = $$new_props._class);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);
    	return [element, _class, $$props, $$scope, slots, div_binding];
    }

    class Scrollable extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { element: 0, class: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Scrollable",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get element() {
    		throw new Error("<Scrollable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Scrollable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Scrollable>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Scrollable>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@kahi-ui/framework/components/layouts/spacer/Spacer.svelte generated by Svelte v3.42.5 */

    const file$9 = "node_modules/@kahi-ui/framework/components/layouts/spacer/Spacer.svelte";

    // (30:0) {:else}
    function create_else_block$7(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let div_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		{
    			class: div_class_value = "spacer " + /*_class*/ ctx[1]
    		},
    		map_data_attributes({
    			orientation: /*orientation*/ ctx[2],
    			spacing: /*spacing*/ ctx[4],
    			"spacing-x": /*spacing_x*/ ctx[5],
    			"spacing-y": /*spacing_y*/ ctx[6]
    		})
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$9, 30, 4, 725);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[11](div);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				(!current || dirty & /*_class*/ 2 && div_class_value !== (div_class_value = "spacer " + /*_class*/ ctx[1])) && { class: div_class_value },
    				dirty & /*orientation, spacing, spacing_x, spacing_y*/ 116 && map_data_attributes({
    					orientation: /*orientation*/ ctx[2],
    					spacing: /*spacing*/ ctx[4],
    					"spacing-x": /*spacing_x*/ ctx[5],
    					"spacing-y": /*spacing_y*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[11](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$7.name,
    		type: "else",
    		source: "(30:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (16:0) {#if variation === "inline"}
    function create_if_block$8(ctx) {
    	let span;
    	let span_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let span_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		{
    			class: span_class_value = "spacer " + /*_class*/ ctx[1]
    		},
    		map_data_attributes({
    			orientation: /*orientation*/ ctx[2],
    			spacing: /*spacing*/ ctx[4],
    			"spacing-x": /*spacing_x*/ ctx[5],
    			"spacing-y": /*spacing_y*/ ctx[6]
    		})
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span, span_data);
    			add_location(span, file$9, 16, 4, 404);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[10](span);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				(!current || dirty & /*_class*/ 2 && span_class_value !== (span_class_value = "spacer " + /*_class*/ ctx[1])) && { class: span_class_value },
    				dirty & /*orientation, spacing, spacing_x, spacing_y*/ 116 && map_data_attributes({
    					orientation: /*orientation*/ ctx[2],
    					spacing: /*spacing*/ ctx[4],
    					"spacing-x": /*spacing_x*/ ctx[5],
    					"spacing-y": /*spacing_y*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(16:0) {#if variation === \\\"inline\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$8, create_else_block$7];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*variation*/ ctx[3] === "inline") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Spacer', slots, ['default']);
    	
    	
    	
    	
    	let { element = undefined } = $$props;
    	let { class: _class = "" } = $$props;
    	let { orientation = undefined } = $$props;
    	let { variation = undefined } = $$props;
    	let { spacing = undefined } = $$props;
    	let { spacing_x = undefined } = $$props;
    	let { spacing_y = undefined } = $$props;

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(7, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(1, _class = $$new_props.class);
    		if ('orientation' in $$new_props) $$invalidate(2, orientation = $$new_props.orientation);
    		if ('variation' in $$new_props) $$invalidate(3, variation = $$new_props.variation);
    		if ('spacing' in $$new_props) $$invalidate(4, spacing = $$new_props.spacing);
    		if ('spacing_x' in $$new_props) $$invalidate(5, spacing_x = $$new_props.spacing_x);
    		if ('spacing_y' in $$new_props) $$invalidate(6, spacing_y = $$new_props.spacing_y);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		map_data_attributes,
    		map_global_attributes,
    		element,
    		_class,
    		orientation,
    		variation,
    		spacing,
    		spacing_x,
    		spacing_y
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(7, $$props = assign(assign({}, $$props), $$new_props));
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('_class' in $$props) $$invalidate(1, _class = $$new_props._class);
    		if ('orientation' in $$props) $$invalidate(2, orientation = $$new_props.orientation);
    		if ('variation' in $$props) $$invalidate(3, variation = $$new_props.variation);
    		if ('spacing' in $$props) $$invalidate(4, spacing = $$new_props.spacing);
    		if ('spacing_x' in $$props) $$invalidate(5, spacing_x = $$new_props.spacing_x);
    		if ('spacing_y' in $$props) $$invalidate(6, spacing_y = $$new_props.spacing_y);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		element,
    		_class,
    		orientation,
    		variation,
    		spacing,
    		spacing_x,
    		spacing_y,
    		$$props,
    		$$scope,
    		slots,
    		span_binding,
    		div_binding
    	];
    }

    class Spacer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			element: 0,
    			class: 1,
    			orientation: 2,
    			variation: 3,
    			spacing: 4,
    			spacing_x: 5,
    			spacing_y: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Spacer",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get element() {
    		throw new Error("<Spacer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Spacer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Spacer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Spacer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get orientation() {
    		throw new Error("<Spacer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set orientation(value) {
    		throw new Error("<Spacer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variation() {
    		throw new Error("<Spacer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variation(value) {
    		throw new Error("<Spacer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing() {
    		throw new Error("<Spacer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing(value) {
    		throw new Error("<Spacer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing_x() {
    		throw new Error("<Spacer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing_x(value) {
    		throw new Error("<Spacer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing_y() {
    		throw new Error("<Spacer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing_y(value) {
    		throw new Error("<Spacer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@kahi-ui/framework/components/layouts/stack/Stack.svelte generated by Svelte v3.42.5 */

    const file$8 = "node_modules/@kahi-ui/framework/components/layouts/stack/Stack.svelte";

    function create_fragment$a(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	let div_levels = [
    		map_global_attributes(/*$$props*/ ctx[10]),
    		{
    			class: div_class_value = "stack " + /*_class*/ ctx[1]
    		},
    		map_data_attributes({
    			alignment: /*alignment*/ ctx[4],
    			"alignment-x": /*alignment_x*/ ctx[5],
    			"alignment-y": /*alignment_y*/ ctx[6],
    			orientation: /*orientation*/ ctx[2],
    			spacing: /*spacing*/ ctx[7],
    			"spacing-x": /*spacing_x*/ ctx[8],
    			"spacing-y": /*spacing_y*/ ctx[9],
    			variation: /*variation*/ ctx[3]
    		})
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$8, 21, 0, 483);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[13](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$props*/ 1024 && map_global_attributes(/*$$props*/ ctx[10]),
    				(!current || dirty & /*_class*/ 2 && div_class_value !== (div_class_value = "stack " + /*_class*/ ctx[1])) && { class: div_class_value },
    				dirty & /*alignment, alignment_x, alignment_y, orientation, spacing, spacing_x, spacing_y, variation*/ 1020 && map_data_attributes({
    					alignment: /*alignment*/ ctx[4],
    					"alignment-x": /*alignment_x*/ ctx[5],
    					"alignment-y": /*alignment_y*/ ctx[6],
    					orientation: /*orientation*/ ctx[2],
    					spacing: /*spacing*/ ctx[7],
    					"spacing-x": /*spacing_x*/ ctx[8],
    					"spacing-y": /*spacing_y*/ ctx[9],
    					variation: /*variation*/ ctx[3]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[13](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Stack', slots, ['default']);
    	
    	
    	
    	
    	
    	
    	
    	let { element = undefined } = $$props;
    	let { class: _class = "" } = $$props;
    	let { orientation = undefined } = $$props;
    	let { variation = undefined } = $$props;
    	let { alignment = undefined } = $$props;
    	let { alignment_x = undefined } = $$props;
    	let { alignment_y = undefined } = $$props;
    	let { spacing = undefined } = $$props;
    	let { spacing_x = undefined } = $$props;
    	let { spacing_y = undefined } = $$props;

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(10, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(1, _class = $$new_props.class);
    		if ('orientation' in $$new_props) $$invalidate(2, orientation = $$new_props.orientation);
    		if ('variation' in $$new_props) $$invalidate(3, variation = $$new_props.variation);
    		if ('alignment' in $$new_props) $$invalidate(4, alignment = $$new_props.alignment);
    		if ('alignment_x' in $$new_props) $$invalidate(5, alignment_x = $$new_props.alignment_x);
    		if ('alignment_y' in $$new_props) $$invalidate(6, alignment_y = $$new_props.alignment_y);
    		if ('spacing' in $$new_props) $$invalidate(7, spacing = $$new_props.spacing);
    		if ('spacing_x' in $$new_props) $$invalidate(8, spacing_x = $$new_props.spacing_x);
    		if ('spacing_y' in $$new_props) $$invalidate(9, spacing_y = $$new_props.spacing_y);
    		if ('$$scope' in $$new_props) $$invalidate(11, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		map_data_attributes,
    		map_global_attributes,
    		element,
    		_class,
    		orientation,
    		variation,
    		alignment,
    		alignment_x,
    		alignment_y,
    		spacing,
    		spacing_x,
    		spacing_y
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(10, $$props = assign(assign({}, $$props), $$new_props));
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('_class' in $$props) $$invalidate(1, _class = $$new_props._class);
    		if ('orientation' in $$props) $$invalidate(2, orientation = $$new_props.orientation);
    		if ('variation' in $$props) $$invalidate(3, variation = $$new_props.variation);
    		if ('alignment' in $$props) $$invalidate(4, alignment = $$new_props.alignment);
    		if ('alignment_x' in $$props) $$invalidate(5, alignment_x = $$new_props.alignment_x);
    		if ('alignment_y' in $$props) $$invalidate(6, alignment_y = $$new_props.alignment_y);
    		if ('spacing' in $$props) $$invalidate(7, spacing = $$new_props.spacing);
    		if ('spacing_x' in $$props) $$invalidate(8, spacing_x = $$new_props.spacing_x);
    		if ('spacing_y' in $$props) $$invalidate(9, spacing_y = $$new_props.spacing_y);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		element,
    		_class,
    		orientation,
    		variation,
    		alignment,
    		alignment_x,
    		alignment_y,
    		spacing,
    		spacing_x,
    		spacing_y,
    		$$props,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Stack extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			element: 0,
    			class: 1,
    			orientation: 2,
    			variation: 3,
    			alignment: 4,
    			alignment_x: 5,
    			alignment_y: 6,
    			spacing: 7,
    			spacing_x: 8,
    			spacing_y: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Stack",
    			options,
    			id: create_fragment$a.name
    		});
    	}

    	get element() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get orientation() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set orientation(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variation() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variation(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alignment() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alignment(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alignment_x() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alignment_x(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get alignment_y() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set alignment_y(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing_x() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing_x(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get spacing_y() {
    		throw new Error("<Stack>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set spacing_y(value) {
    		throw new Error("<Stack>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var MEDIA_QUERIES_BEHAVIORS;
    (function (MEDIA_QUERIES_BEHAVIORS) {
        MEDIA_QUERIES_BEHAVIORS["and"] = "and";
        MEDIA_QUERIES_BEHAVIORS["or"] = "or";
    })(MEDIA_QUERIES_BEHAVIORS || (MEDIA_QUERIES_BEHAVIORS = {}));

    var VIEWPORT_NAMES;
    (function (VIEWPORT_NAMES) {
        VIEWPORT_NAMES["mobile"] = "mobile";
        VIEWPORT_NAMES["tablet"] = "tablet";
        VIEWPORT_NAMES["desktop"] = "desktop";
        VIEWPORT_NAMES["widescreen"] = "widescreen";
    })(VIEWPORT_NAMES || (VIEWPORT_NAMES = {}));

    /* node_modules/@kahi-ui/framework/components/typography/text/Text.svelte generated by Svelte v3.42.5 */

    const file$7 = "node_modules/@kahi-ui/framework/components/typography/text/Text.svelte";

    // (158:0) {:else}
    function create_else_block$6(ctx) {
    	let p;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let p_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let p_data = {};

    	for (let i = 0; i < p_levels.length; i += 1) {
    		p_data = assign(p_data, p_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			p = element("p");
    			if (default_slot) default_slot.c();
    			set_attributes(p, p_data);
    			add_location(p, file$7, 158, 4, 4123);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);

    			if (default_slot) {
    				default_slot.m(p, null);
    			}

    			/*p_binding*/ ctx[27](p);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(p, p_data = get_spread_update(p_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (default_slot) default_slot.d(detaching);
    			/*p_binding*/ ctx[27](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$6.name,
    		type: "else",
    		source: "(158:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (150:21) 
    function create_if_block_16(ctx) {
    	let u;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let u_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let u_data = {};

    	for (let i = 0; i < u_levels.length; i += 1) {
    		u_data = assign(u_data, u_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			u = element("u");
    			if (default_slot) default_slot.c();
    			set_attributes(u, u_data);
    			add_location(u, file$7, 150, 4, 3925);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, u, anchor);

    			if (default_slot) {
    				default_slot.m(u, null);
    			}

    			/*u_binding*/ ctx[26](u);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(u, u_data = get_spread_update(u_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(u);
    			if (default_slot) default_slot.d(detaching);
    			/*u_binding*/ ctx[26](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_16.name,
    		type: "if",
    		source: "(150:21) ",
    		ctx
    	});

    	return block;
    }

    // (142:23) 
    function create_if_block_15(ctx) {
    	let sup;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let sup_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let sup_data = {};

    	for (let i = 0; i < sup_levels.length; i += 1) {
    		sup_data = assign(sup_data, sup_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			sup = element("sup");
    			if (default_slot) default_slot.c();
    			set_attributes(sup, sup_data);
    			add_location(sup, file$7, 142, 4, 3709);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, sup, anchor);

    			if (default_slot) {
    				default_slot.m(sup, null);
    			}

    			/*sup_binding*/ ctx[25](sup);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(sup, sup_data = get_spread_update(sup_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(sup);
    			if (default_slot) default_slot.d(detaching);
    			/*sup_binding*/ ctx[25](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_15.name,
    		type: "if",
    		source: "(142:23) ",
    		ctx
    	});

    	return block;
    }

    // (134:23) 
    function create_if_block_14(ctx) {
    	let sub;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let sub_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let sub_data = {};

    	for (let i = 0; i < sub_levels.length; i += 1) {
    		sub_data = assign(sub_data, sub_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			sub = element("sub");
    			if (default_slot) default_slot.c();
    			set_attributes(sub, sub_data);
    			add_location(sub, file$7, 134, 4, 3491);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, sub, anchor);

    			if (default_slot) {
    				default_slot.m(sub, null);
    			}

    			/*sub_binding*/ ctx[24](sub);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(sub, sub_data = get_spread_update(sub_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(sub);
    			if (default_slot) default_slot.d(detaching);
    			/*sub_binding*/ ctx[24](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_14.name,
    		type: "if",
    		source: "(134:23) ",
    		ctx
    	});

    	return block;
    }

    // (126:26) 
    function create_if_block_13(ctx) {
    	let strong;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let strong_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let strong_data = {};

    	for (let i = 0; i < strong_levels.length; i += 1) {
    		strong_data = assign(strong_data, strong_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			strong = element("strong");
    			if (default_slot) default_slot.c();
    			set_attributes(strong, strong_data);
    			add_location(strong, file$7, 126, 4, 3267);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, strong, anchor);

    			if (default_slot) {
    				default_slot.m(strong, null);
    			}

    			/*strong_binding*/ ctx[23](strong);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(strong, strong_data = get_spread_update(strong_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(strong);
    			if (default_slot) default_slot.d(detaching);
    			/*strong_binding*/ ctx[23](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_13.name,
    		type: "if",
    		source: "(126:26) ",
    		ctx
    	});

    	return block;
    }

    // (118:24) 
    function create_if_block_12(ctx) {
    	let span;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let span_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let span_data = {};

    	for (let i = 0; i < span_levels.length; i += 1) {
    		span_data = assign(span_data, span_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			span = element("span");
    			if (default_slot) default_slot.c();
    			set_attributes(span, span_data);
    			add_location(span, file$7, 118, 4, 3044);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);

    			if (default_slot) {
    				default_slot.m(span, null);
    			}

    			/*span_binding*/ ctx[22](span);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(span, span_data = get_spread_update(span_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			if (default_slot) default_slot.d(detaching);
    			/*span_binding*/ ctx[22](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_12.name,
    		type: "if",
    		source: "(118:24) ",
    		ctx
    	});

    	return block;
    }

    // (110:25) 
    function create_if_block_11(ctx) {
    	let small;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let small_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let small_data = {};

    	for (let i = 0; i < small_levels.length; i += 1) {
    		small_data = assign(small_data, small_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			small = element("small");
    			if (default_slot) default_slot.c();
    			set_attributes(small, small_data);
    			add_location(small, file$7, 110, 4, 2821);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, small, anchor);

    			if (default_slot) {
    				default_slot.m(small, null);
    			}

    			/*small_binding*/ ctx[21](small);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(small, small_data = get_spread_update(small_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(small);
    			if (default_slot) default_slot.d(detaching);
    			/*small_binding*/ ctx[21](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_11.name,
    		type: "if",
    		source: "(110:25) ",
    		ctx
    	});

    	return block;
    }

    // (102:24) 
    function create_if_block_10(ctx) {
    	let samp;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let samp_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let samp_data = {};

    	for (let i = 0; i < samp_levels.length; i += 1) {
    		samp_data = assign(samp_data, samp_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			samp = element("samp");
    			if (default_slot) default_slot.c();
    			set_attributes(samp, samp_data);
    			add_location(samp, file$7, 102, 4, 2599);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, samp, anchor);

    			if (default_slot) {
    				default_slot.m(samp, null);
    			}

    			/*samp_binding*/ ctx[20](samp);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(samp, samp_data = get_spread_update(samp_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(samp);
    			if (default_slot) default_slot.d(detaching);
    			/*samp_binding*/ ctx[20](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_10.name,
    		type: "if",
    		source: "(102:24) ",
    		ctx
    	});

    	return block;
    }

    // (94:21) 
    function create_if_block_9(ctx) {
    	let s;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let s_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let s_data = {};

    	for (let i = 0; i < s_levels.length; i += 1) {
    		s_data = assign(s_data, s_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			s = element("s");
    			if (default_slot) default_slot.c();
    			set_attributes(s, s_data);
    			add_location(s, file$7, 94, 4, 2384);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, s, anchor);

    			if (default_slot) {
    				default_slot.m(s, null);
    			}

    			/*s_binding*/ ctx[19](s);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(s, s_data = get_spread_update(s_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(s);
    			if (default_slot) default_slot.d(detaching);
    			/*s_binding*/ ctx[19](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_9.name,
    		type: "if",
    		source: "(94:21) ",
    		ctx
    	});

    	return block;
    }

    // (81:23) 
    function create_if_block_8(ctx) {
    	let pre;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let pre_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let pre_data = {};

    	for (let i = 0; i < pre_levels.length; i += 1) {
    		pre_data = assign(pre_data, pre_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			pre = element("pre");
    			if (default_slot) default_slot.c();
    			set_attributes(pre, pre_data);
    			add_location(pre, file$7, 81, 4, 2098);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre, anchor);

    			if (default_slot) {
    				default_slot.m(pre, null);
    			}

    			/*pre_binding*/ ctx[18](pre);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(pre, pre_data = get_spread_update(pre_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre);
    			if (default_slot) default_slot.d(detaching);
    			/*pre_binding*/ ctx[18](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(81:23) ",
    		ctx
    	});

    	return block;
    }

    // (73:24) 
    function create_if_block_7(ctx) {
    	let mark;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let mark_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let mark_data = {};

    	for (let i = 0; i < mark_levels.length; i += 1) {
    		mark_data = assign(mark_data, mark_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			mark = element("mark");
    			if (default_slot) default_slot.c();
    			set_attributes(mark, mark_data);
    			add_location(mark, file$7, 73, 4, 1878);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, mark, anchor);

    			if (default_slot) {
    				default_slot.m(mark, null);
    			}

    			/*mark_binding*/ ctx[17](mark);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(mark, mark_data = get_spread_update(mark_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(mark);
    			if (default_slot) default_slot.d(detaching);
    			/*mark_binding*/ ctx[17](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(73:24) ",
    		ctx
    	});

    	return block;
    }

    // (65:23) 
    function create_if_block_6$1(ctx) {
    	let kbd;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let kbd_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let kbd_data = {};

    	for (let i = 0; i < kbd_levels.length; i += 1) {
    		kbd_data = assign(kbd_data, kbd_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			kbd = element("kbd");
    			if (default_slot) default_slot.c();
    			set_attributes(kbd, kbd_data);
    			add_location(kbd, file$7, 65, 4, 1659);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, kbd, anchor);

    			if (default_slot) {
    				default_slot.m(kbd, null);
    			}

    			/*kbd_binding*/ ctx[16](kbd);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(kbd, kbd_data = get_spread_update(kbd_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(kbd);
    			if (default_slot) default_slot.d(detaching);
    			/*kbd_binding*/ ctx[16](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6$1.name,
    		type: "if",
    		source: "(65:23) ",
    		ctx
    	});

    	return block;
    }

    // (57:23) 
    function create_if_block_5$1(ctx) {
    	let ins;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let ins_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let ins_data = {};

    	for (let i = 0; i < ins_levels.length; i += 1) {
    		ins_data = assign(ins_data, ins_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			ins = element("ins");
    			if (default_slot) default_slot.c();
    			set_attributes(ins, ins_data);
    			add_location(ins, file$7, 57, 4, 1441);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ins, anchor);

    			if (default_slot) {
    				default_slot.m(ins, null);
    			}

    			/*ins_binding*/ ctx[15](ins);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(ins, ins_data = get_spread_update(ins_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ins);
    			if (default_slot) default_slot.d(detaching);
    			/*ins_binding*/ ctx[15](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5$1.name,
    		type: "if",
    		source: "(57:23) ",
    		ctx
    	});

    	return block;
    }

    // (49:21) 
    function create_if_block_4$3(ctx) {
    	let i;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let i_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let i_data = {};

    	for (let i = 0; i < i_levels.length; i += 1) {
    		i_data = assign(i_data, i_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			i = element("i");
    			if (default_slot) default_slot.c();
    			set_attributes(i, i_data);
    			add_location(i, file$7, 49, 4, 1227);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, i, anchor);

    			if (default_slot) {
    				default_slot.m(i, null);
    			}

    			/*i_binding*/ ctx[14](i);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(i, i_data = get_spread_update(i_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(i);
    			if (default_slot) default_slot.d(detaching);
    			/*i_binding*/ ctx[14](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$3.name,
    		type: "if",
    		source: "(49:21) ",
    		ctx
    	});

    	return block;
    }

    // (41:22) 
    function create_if_block_3$3(ctx) {
    	let em;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let em_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let em_data = {};

    	for (let i = 0; i < em_levels.length; i += 1) {
    		em_data = assign(em_data, em_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			em = element("em");
    			if (default_slot) default_slot.c();
    			set_attributes(em, em_data);
    			add_location(em, file$7, 41, 4, 1013);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, em, anchor);

    			if (default_slot) {
    				default_slot.m(em, null);
    			}

    			/*em_binding*/ ctx[13](em);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(em, em_data = get_spread_update(em_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(em);
    			if (default_slot) default_slot.d(detaching);
    			/*em_binding*/ ctx[13](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$3.name,
    		type: "if",
    		source: "(41:22) ",
    		ctx
    	});

    	return block;
    }

    // (33:23) 
    function create_if_block_2$3(ctx) {
    	let del;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let del_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let del_data = {};

    	for (let i = 0; i < del_levels.length; i += 1) {
    		del_data = assign(del_data, del_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			del = element("del");
    			if (default_slot) default_slot.c();
    			set_attributes(del, del_data);
    			add_location(del, file$7, 33, 4, 796);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, del, anchor);

    			if (default_slot) {
    				default_slot.m(del, null);
    			}

    			/*del_binding*/ ctx[12](del);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(del, del_data = get_spread_update(del_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(del);
    			if (default_slot) default_slot.d(detaching);
    			/*del_binding*/ ctx[12](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$3.name,
    		type: "if",
    		source: "(33:23) ",
    		ctx
    	});

    	return block;
    }

    // (25:21) 
    function create_if_block_1$3(ctx) {
    	let b;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let b_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let b_data = {};

    	for (let i = 0; i < b_levels.length; i += 1) {
    		b_data = assign(b_data, b_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			b = element("b");
    			if (default_slot) default_slot.c();
    			set_attributes(b, b_data);
    			add_location(b, file$7, 25, 4, 582);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, b, anchor);

    			if (default_slot) {
    				default_slot.m(b, null);
    			}

    			/*b_binding*/ ctx[11](b);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(b, b_data = get_spread_update(b_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(b);
    			if (default_slot) default_slot.d(detaching);
    			/*b_binding*/ ctx[11](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(25:21) ",
    		ctx
    	});

    	return block;
    }

    // (17:0) {#if is === "abbr"}
    function create_if_block$7(ctx) {
    	let abbr;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	let abbr_levels = [
    		map_global_attributes(/*$$props*/ ctx[7]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[5],
    			size: /*size*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[6]
    		})
    	];

    	let abbr_data = {};

    	for (let i = 0; i < abbr_levels.length; i += 1) {
    		abbr_data = assign(abbr_data, abbr_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			abbr = element("abbr");
    			if (default_slot) default_slot.c();
    			set_attributes(abbr, abbr_data);
    			add_location(abbr, file$7, 17, 4, 364);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, abbr, anchor);

    			if (default_slot) {
    				default_slot.m(abbr, null);
    			}

    			/*abbr_binding*/ ctx[10](abbr);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(abbr, abbr_data = get_spread_update(abbr_levels, [
    				dirty & /*$$props*/ 128 && map_global_attributes(/*$$props*/ ctx[7]),
    				dirty & /*align, palette, size, transform, variation*/ 124 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[5],
    					size: /*size*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[6]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(abbr);
    			if (default_slot) default_slot.d(detaching);
    			/*abbr_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(17:0) {#if is === \\\"abbr\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block$7,
    		create_if_block_1$3,
    		create_if_block_2$3,
    		create_if_block_3$3,
    		create_if_block_4$3,
    		create_if_block_5$1,
    		create_if_block_6$1,
    		create_if_block_7,
    		create_if_block_8,
    		create_if_block_9,
    		create_if_block_10,
    		create_if_block_11,
    		create_if_block_12,
    		create_if_block_13,
    		create_if_block_14,
    		create_if_block_15,
    		create_if_block_16,
    		create_else_block$6
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*is*/ ctx[1] === "abbr") return 0;
    		if (/*is*/ ctx[1] === "b") return 1;
    		if (/*is*/ ctx[1] === "del") return 2;
    		if (/*is*/ ctx[1] === "em") return 3;
    		if (/*is*/ ctx[1] === "i") return 4;
    		if (/*is*/ ctx[1] === "ins") return 5;
    		if (/*is*/ ctx[1] === "kbd") return 6;
    		if (/*is*/ ctx[1] === "mark") return 7;
    		if (/*is*/ ctx[1] === "pre") return 8;
    		if (/*is*/ ctx[1] === "s") return 9;
    		if (/*is*/ ctx[1] === "samp") return 10;
    		if (/*is*/ ctx[1] === "small") return 11;
    		if (/*is*/ ctx[1] === "span") return 12;
    		if (/*is*/ ctx[1] === "strong") return 13;
    		if (/*is*/ ctx[1] === "sub") return 14;
    		if (/*is*/ ctx[1] === "sup") return 15;
    		if (/*is*/ ctx[1] === "u") return 16;
    		return 17;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Text', slots, ['default']);
    	
    	
    	
    	
    	
    	
    	let { element = undefined } = $$props;
    	let { is = "p" } = $$props;
    	let { align = undefined } = $$props;
    	let { transform = undefined } = $$props;
    	let { size = undefined } = $$props;
    	let { palette = undefined } = $$props;
    	let { variation = undefined } = $$props;

    	function abbr_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function b_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function del_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function em_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function i_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function ins_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function kbd_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function mark_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function pre_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function s_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function samp_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function small_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function span_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function strong_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function sub_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function sup_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function u_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function p_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(7, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('is' in $$new_props) $$invalidate(1, is = $$new_props.is);
    		if ('align' in $$new_props) $$invalidate(2, align = $$new_props.align);
    		if ('transform' in $$new_props) $$invalidate(3, transform = $$new_props.transform);
    		if ('size' in $$new_props) $$invalidate(4, size = $$new_props.size);
    		if ('palette' in $$new_props) $$invalidate(5, palette = $$new_props.palette);
    		if ('variation' in $$new_props) $$invalidate(6, variation = $$new_props.variation);
    		if ('$$scope' in $$new_props) $$invalidate(8, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		map_data_attributes,
    		map_global_attributes,
    		element,
    		is,
    		align,
    		transform,
    		size,
    		palette,
    		variation
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(7, $$props = assign(assign({}, $$props), $$new_props));
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('is' in $$props) $$invalidate(1, is = $$new_props.is);
    		if ('align' in $$props) $$invalidate(2, align = $$new_props.align);
    		if ('transform' in $$props) $$invalidate(3, transform = $$new_props.transform);
    		if ('size' in $$props) $$invalidate(4, size = $$new_props.size);
    		if ('palette' in $$props) $$invalidate(5, palette = $$new_props.palette);
    		if ('variation' in $$props) $$invalidate(6, variation = $$new_props.variation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		element,
    		is,
    		align,
    		transform,
    		size,
    		palette,
    		variation,
    		$$props,
    		$$scope,
    		slots,
    		abbr_binding,
    		b_binding,
    		del_binding,
    		em_binding,
    		i_binding,
    		ins_binding,
    		kbd_binding,
    		mark_binding,
    		pre_binding,
    		s_binding,
    		samp_binding,
    		small_binding,
    		span_binding,
    		strong_binding,
    		sub_binding,
    		sup_binding,
    		u_binding,
    		p_binding
    	];
    }

    class Text extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$9, create_fragment$9, safe_not_equal, {
    			element: 0,
    			is: 1,
    			align: 2,
    			transform: 3,
    			size: 4,
    			palette: 5,
    			variation: 6
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Text",
    			options,
    			id: create_fragment$9.name
    		});
    	}

    	get element() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get is() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set is(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transform() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transform(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get palette() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set palette(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variation() {
    		throw new Error("<Text>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variation(value) {
    		throw new Error("<Text>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@kahi-ui/framework/components/surfaces/box/Box.svelte generated by Svelte v3.42.5 */

    const file$6 = "node_modules/@kahi-ui/framework/components/surfaces/box/Box.svelte";

    function create_fragment$8(ctx) {
    	let div;
    	let div_class_value;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	let div_levels = [
    		map_global_attributes(/*$$props*/ ctx[5]),
    		{
    			class: div_class_value = "box " + /*_class*/ ctx[1]
    		},
    		map_data_attributes({
    			elevation: /*elevation*/ ctx[2],
    			palette: /*palette*/ ctx[3],
    			shape: /*shape*/ ctx[4]
    		})
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			set_attributes(div, div_data);
    			add_location(div, file$6, 16, 0, 303);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[8](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 64)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[6],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[6])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*$$props*/ 32 && map_global_attributes(/*$$props*/ ctx[5]),
    				(!current || dirty & /*_class*/ 2 && div_class_value !== (div_class_value = "box " + /*_class*/ ctx[1])) && { class: div_class_value },
    				dirty & /*elevation, palette, shape*/ 28 && map_data_attributes({
    					elevation: /*elevation*/ ctx[2],
    					palette: /*palette*/ ctx[3],
    					shape: /*shape*/ ctx[4]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Box', slots, ['default']);
    	
    	
    	
    	
    	
    	
    	
    	let { element = undefined } = $$props;
    	let { class: _class = "" } = $$props;
    	let { elevation = undefined } = $$props;
    	let { palette = undefined } = $$props;
    	let { shape = undefined } = $$props;

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('class' in $$new_props) $$invalidate(1, _class = $$new_props.class);
    		if ('elevation' in $$new_props) $$invalidate(2, elevation = $$new_props.elevation);
    		if ('palette' in $$new_props) $$invalidate(3, palette = $$new_props.palette);
    		if ('shape' in $$new_props) $$invalidate(4, shape = $$new_props.shape);
    		if ('$$scope' in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		map_data_attributes,
    		map_global_attributes,
    		element,
    		_class,
    		elevation,
    		palette,
    		shape
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('_class' in $$props) $$invalidate(1, _class = $$new_props._class);
    		if ('elevation' in $$props) $$invalidate(2, elevation = $$new_props.elevation);
    		if ('palette' in $$props) $$invalidate(3, palette = $$new_props.palette);
    		if ('shape' in $$props) $$invalidate(4, shape = $$new_props.shape);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		element,
    		_class,
    		elevation,
    		palette,
    		shape,
    		$$props,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Box extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$8, create_fragment$8, safe_not_equal, {
    			element: 0,
    			class: 1,
    			elevation: 2,
    			palette: 3,
    			shape: 4
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Box",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get element() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get class() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set class(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get elevation() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set elevation(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get palette() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set palette(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get shape() {
    		throw new Error("<Box>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set shape(value) {
    		throw new Error("<Box>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/@kahi-ui/framework/components/typography/heading/Heading.svelte generated by Svelte v3.42.5 */

    const file$5 = "node_modules/@kahi-ui/framework/components/typography/heading/Heading.svelte";

    // (55:0) {:else}
    function create_else_block$5(ctx) {
    	let h1;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let h1_levels = [
    		map_global_attributes(/*$$props*/ ctx[6]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[5]
    		})
    	];

    	let h1_data = {};

    	for (let i = 0; i < h1_levels.length; i += 1) {
    		h1_data = assign(h1_data, h1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			if (default_slot) default_slot.c();
    			set_attributes(h1, h1_data);
    			add_location(h1, file$5, 55, 4, 1362);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);

    			if (default_slot) {
    				default_slot.m(h1, null);
    			}

    			/*h1_binding*/ ctx[14](h1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(h1, h1_data = get_spread_update(h1_levels, [
    				dirty & /*$$props*/ 64 && map_global_attributes(/*$$props*/ ctx[6]),
    				dirty & /*align, palette, transform, variation*/ 60 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[5]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (default_slot) default_slot.d(detaching);
    			/*h1_binding*/ ctx[14](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(55:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (47:22) 
    function create_if_block_4$2(ctx) {
    	let h2;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let h2_levels = [
    		map_global_attributes(/*$$props*/ ctx[6]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[5]
    		})
    	];

    	let h2_data = {};

    	for (let i = 0; i < h2_levels.length; i += 1) {
    		h2_data = assign(h2_data, h2_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			if (default_slot) default_slot.c();
    			set_attributes(h2, h2_data);
    			add_location(h2, file$5, 47, 4, 1168);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);

    			if (default_slot) {
    				default_slot.m(h2, null);
    			}

    			/*h2_binding*/ ctx[13](h2);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(h2, h2_data = get_spread_update(h2_levels, [
    				dirty & /*$$props*/ 64 && map_global_attributes(/*$$props*/ ctx[6]),
    				dirty & /*align, palette, transform, variation*/ 60 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[5]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (default_slot) default_slot.d(detaching);
    			/*h2_binding*/ ctx[13](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$2.name,
    		type: "if",
    		source: "(47:22) ",
    		ctx
    	});

    	return block;
    }

    // (39:22) 
    function create_if_block_3$2(ctx) {
    	let h3;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let h3_levels = [
    		map_global_attributes(/*$$props*/ ctx[6]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[5]
    		})
    	];

    	let h3_data = {};

    	for (let i = 0; i < h3_levels.length; i += 1) {
    		h3_data = assign(h3_data, h3_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			if (default_slot) default_slot.c();
    			set_attributes(h3, h3_data);
    			add_location(h3, file$5, 39, 4, 959);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);

    			if (default_slot) {
    				default_slot.m(h3, null);
    			}

    			/*h3_binding*/ ctx[12](h3);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(h3, h3_data = get_spread_update(h3_levels, [
    				dirty & /*$$props*/ 64 && map_global_attributes(/*$$props*/ ctx[6]),
    				dirty & /*align, palette, transform, variation*/ 60 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[5]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (default_slot) default_slot.d(detaching);
    			/*h3_binding*/ ctx[12](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$2.name,
    		type: "if",
    		source: "(39:22) ",
    		ctx
    	});

    	return block;
    }

    // (31:22) 
    function create_if_block_2$2(ctx) {
    	let h4;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let h4_levels = [
    		map_global_attributes(/*$$props*/ ctx[6]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[5]
    		})
    	];

    	let h4_data = {};

    	for (let i = 0; i < h4_levels.length; i += 1) {
    		h4_data = assign(h4_data, h4_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			h4 = element("h4");
    			if (default_slot) default_slot.c();
    			set_attributes(h4, h4_data);
    			add_location(h4, file$5, 31, 4, 750);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h4, anchor);

    			if (default_slot) {
    				default_slot.m(h4, null);
    			}

    			/*h4_binding*/ ctx[11](h4);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(h4, h4_data = get_spread_update(h4_levels, [
    				dirty & /*$$props*/ 64 && map_global_attributes(/*$$props*/ ctx[6]),
    				dirty & /*align, palette, transform, variation*/ 60 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[5]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h4);
    			if (default_slot) default_slot.d(detaching);
    			/*h4_binding*/ ctx[11](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(31:22) ",
    		ctx
    	});

    	return block;
    }

    // (23:22) 
    function create_if_block_1$2(ctx) {
    	let h5;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let h5_levels = [
    		map_global_attributes(/*$$props*/ ctx[6]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[5]
    		})
    	];

    	let h5_data = {};

    	for (let i = 0; i < h5_levels.length; i += 1) {
    		h5_data = assign(h5_data, h5_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			h5 = element("h5");
    			if (default_slot) default_slot.c();
    			set_attributes(h5, h5_data);
    			add_location(h5, file$5, 23, 4, 541);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h5, anchor);

    			if (default_slot) {
    				default_slot.m(h5, null);
    			}

    			/*h5_binding*/ ctx[10](h5);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(h5, h5_data = get_spread_update(h5_levels, [
    				dirty & /*$$props*/ 64 && map_global_attributes(/*$$props*/ ctx[6]),
    				dirty & /*align, palette, transform, variation*/ 60 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[5]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h5);
    			if (default_slot) default_slot.d(detaching);
    			/*h5_binding*/ ctx[10](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(23:22) ",
    		ctx
    	});

    	return block;
    }

    // (15:0) {#if is === "h6"}
    function create_if_block$6(ctx) {
    	let h6;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[8].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	let h6_levels = [
    		map_global_attributes(/*$$props*/ ctx[6]),
    		map_data_attributes({
    			align: /*align*/ ctx[2],
    			palette: /*palette*/ ctx[4],
    			transform: /*transform*/ ctx[3],
    			variation: /*variation*/ ctx[5]
    		})
    	];

    	let h6_data = {};

    	for (let i = 0; i < h6_levels.length; i += 1) {
    		h6_data = assign(h6_data, h6_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			h6 = element("h6");
    			if (default_slot) default_slot.c();
    			set_attributes(h6, h6_data);
    			add_location(h6, file$5, 15, 4, 332);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h6, anchor);

    			if (default_slot) {
    				default_slot.m(h6, null);
    			}

    			/*h6_binding*/ ctx[9](h6);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 128)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[7],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[7])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[7], dirty, null),
    						null
    					);
    				}
    			}

    			set_attributes(h6, h6_data = get_spread_update(h6_levels, [
    				dirty & /*$$props*/ 64 && map_global_attributes(/*$$props*/ ctx[6]),
    				dirty & /*align, palette, transform, variation*/ 60 && map_data_attributes({
    					align: /*align*/ ctx[2],
    					palette: /*palette*/ ctx[4],
    					transform: /*transform*/ ctx[3],
    					variation: /*variation*/ ctx[5]
    				})
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h6);
    			if (default_slot) default_slot.d(detaching);
    			/*h6_binding*/ ctx[9](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(15:0) {#if is === \\\"h6\\\"}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	const if_block_creators = [
    		create_if_block$6,
    		create_if_block_1$2,
    		create_if_block_2$2,
    		create_if_block_3$2,
    		create_if_block_4$2,
    		create_else_block$5
    	];

    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*is*/ ctx[1] === "h6") return 0;
    		if (/*is*/ ctx[1] === "h5") return 1;
    		if (/*is*/ ctx[1] === "h4") return 2;
    		if (/*is*/ ctx[1] === "h3") return 3;
    		if (/*is*/ ctx[1] === "h2") return 4;
    		return 5;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Heading', slots, ['default']);
    	
    	
    	
    	
    	
    	let { element = undefined } = $$props;
    	let { is = "h1" } = $$props;
    	let { align = undefined } = $$props;
    	let { transform = undefined } = $$props;
    	let { palette = undefined } = $$props;
    	let { variation = undefined } = $$props;

    	function h6_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function h5_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function h4_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function h3_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function h2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	function h1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			element = $$value;
    			$$invalidate(0, element);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('element' in $$new_props) $$invalidate(0, element = $$new_props.element);
    		if ('is' in $$new_props) $$invalidate(1, is = $$new_props.is);
    		if ('align' in $$new_props) $$invalidate(2, align = $$new_props.align);
    		if ('transform' in $$new_props) $$invalidate(3, transform = $$new_props.transform);
    		if ('palette' in $$new_props) $$invalidate(4, palette = $$new_props.palette);
    		if ('variation' in $$new_props) $$invalidate(5, variation = $$new_props.variation);
    		if ('$$scope' in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		map_data_attributes,
    		map_global_attributes,
    		element,
    		is,
    		align,
    		transform,
    		palette,
    		variation
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
    		if ('element' in $$props) $$invalidate(0, element = $$new_props.element);
    		if ('is' in $$props) $$invalidate(1, is = $$new_props.is);
    		if ('align' in $$props) $$invalidate(2, align = $$new_props.align);
    		if ('transform' in $$props) $$invalidate(3, transform = $$new_props.transform);
    		if ('palette' in $$props) $$invalidate(4, palette = $$new_props.palette);
    		if ('variation' in $$props) $$invalidate(5, variation = $$new_props.variation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$props = exclude_internal_props($$props);

    	return [
    		element,
    		is,
    		align,
    		transform,
    		palette,
    		variation,
    		$$props,
    		$$scope,
    		slots,
    		h6_binding,
    		h5_binding,
    		h4_binding,
    		h3_binding,
    		h2_binding,
    		h1_binding
    	];
    }

    class Heading extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			element: 0,
    			is: 1,
    			align: 2,
    			transform: 3,
    			palette: 4,
    			variation: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Heading",
    			options,
    			id: create_fragment$7.name
    		});
    	}

    	get element() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set element(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get is() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set is(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get align() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set align(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transform() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transform(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get palette() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set palette(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get variation() {
    		throw new Error("<Heading>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set variation(value) {
    		throw new Error("<Heading>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var store = writable({
        token: null,
        songs: [],
        shortTermSongs: [],
        features: null,
        playlists: null,
        BASE_URL: window.location.href.includes('127.0.0.1') ? 'http://127.0.0.1:8000/' : "https://api.vibify.me/" // api
    });

    const day = 3600 * 24 * 1000;
    const postRequest = (url, blob) => fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(blob)
    });
    const get_song_features = async (token, song_ids, normalize) => {
        console.log("getting details...", song_ids.length);
        // debugger;
        const features = {};
        const songs_to_get = song_ids.length;
        for (let i = 0; i < (songs_to_get / 100) + 1; i++) {
            let feats = await fetch(`https://api.spotify.com/v1/audio-features?ids=${song_ids.slice(i * 100, i * 100 + 100).join(",")}`, { headers: { "Authorization": `Bearer ${token}` } }).then(d => d.json());
            feats["audio_features"].map((_, j) => {
                if (_) {
                    features[song_ids[i * 100 + j]] = [
                        _.danceability,
                        _.energy,
                        _.liveness,
                        _.valence,
                        _.tempo
                    ];
                }
            });
        }
        return features;
    };
    const filterSongsUntilDaysAgo = (songs, days) => {
        let last_time = Date.now() * 1000;
        let end_time = last_time - day * days * 1000;
        return songs.filter(song => song.time >= end_time);
    };
    const getSongsWithOffsets = (token, offset_start, n) => Promise.all([...Array(n).keys()].map(i => fetch(`https://api.spotify.com/v1/me/tracks?offset=${(offset_start + i) * 50}&limit=50`, { headers: { "Authorization": `Bearer ${token}` } })
        .then(d => d.json())))
        .then(respArray => respArray.reduce((all, current) => [...all, ...current.items], []));
    const getSongsUntil = async (token, days) => {
        console.log("getting songs");
        let song_map = {};
        let last_time = Date.now() * 1000;
        let end_time = last_time - day * days * 1000;
        let offset = 0;
        let reached_end = false;
        while (last_time >= end_time && !reached_end) {
            const items = await getSongsWithOffsets(token, offset, 10);
            try {
                if (items.length === 0)
                    reached_end = true;
                items.map(song => {
                    if (reached_end)
                        return;
                    last_time = Date.parse(song.added_at) * 1000;
                    if (song.track.id in song_map) {
                        reached_end = true;
                    }
                    song_map[song.track.id] = {
                        id: song["track"]["id"],
                        name: song["track"]["name"],
                        artist: song["track"]["artists"][0]["name"],
                        time: last_time,
                        feats: []
                    };
                });
            }
            catch (err) {
                console.warn(err);
                reached_end = true;
            }
            offset += 10;
        }
        return Object.values(song_map);
        //  add features
        // const feats = await get_song_features(token, Object.keys(song_map), false)
        // const songs = []
        // Object.keys(feats).map(s_id => {
        //     let s = song_map[s_id]
        //     s.feats = feats[s_id]
        //     songs.push(s)
        // });
        // console.log("found", songs.length)
        // return songs
    };
    const getTracksInfo = (token, ids) => fetch(`https://api.spotify.com/v1/tracks?ids=${ids.join(",")}`, { headers: { "Authorization": `Bearer ${token}` } })
        .then(d => d.json())
        .then(data => data.tracks.map(track => ({
        name: track.name,
        artist: track.artists[0].name,
        img: track.album.images[1].url
    })));

    /* src/Pages/MyMusic.svelte generated by Svelte v3.42.5 */

    const { Object: Object_1$3 } = globals;
    const file$4 = "src/Pages/MyMusic.svelte";

    // (83:16) <Heading is="h3">
    function create_default_slot_16(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Downloading your music");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_16.name,
    		type: "slot",
    		source: "(83:16) <Heading is=\\\"h3\\\">",
    		ctx
    	});

    	return block;
    }

    // (87:39) 
    function create_if_block_6(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_15] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope, $store*/ 258) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(87:39) ",
    		ctx
    	});

    	return block;
    }

    // (85:16) {#if currentStep=="grid"}
    function create_if_block_5(ctx) {
    	let spinner;
    	let current;
    	spinner = new Spinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(85:16) {#if currentStep==\\\"grid\\\"}",
    		ctx
    	});

    	return block;
    }

    // (88:20) <Text>
    function create_default_slot_15(ctx) {
    	let t0_value = /*$store*/ ctx[1].songs.length + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" songs found 🤩");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$store*/ 2 && t0_value !== (t0_value = /*$store*/ ctx[1].songs.length + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_15.name,
    		type: "slot",
    		source: "(88:20) <Text>",
    		ctx
    	});

    	return block;
    }

    // (82:12) <Stack alignment="center">
    function create_default_slot_14(ctx) {
    	let heading;
    	let t0;
    	let spacer;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	heading = new Heading({
    			props: {
    				is: "h3",
    				$$slots: { default: [create_default_slot_16] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	spacer = new Spacer({
    			props: { spacing: "large" },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block_5, create_if_block_6];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*currentStep*/ ctx[0] == "grid") return 0;
    		if (/*$store*/ ctx[1].songs) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			create_component(heading.$$.fragment);
    			t0 = space();
    			create_component(spacer.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(heading, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(spacer, target, anchor);
    			insert_dev(target, t1, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const heading_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				heading_changes.$$scope = { dirty, ctx };
    			}

    			heading.$set(heading_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(heading.$$.fragment, local);
    			transition_in(spacer.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(heading.$$.fragment, local);
    			transition_out(spacer.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(heading, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(spacer, detaching);
    			if (detaching) detach_dev(t1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_14.name,
    		type: "slot",
    		source: "(82:12) <Stack alignment=\\\"center\\\">",
    		ctx
    	});

    	return block;
    }

    // (81:8) <Box shape="rounded" class="fadeIn progressCard" palette={primaryColor} padding="large">
    function create_default_slot_13(ctx) {
    	let stack;
    	let current;

    	stack = new Stack({
    			props: {
    				alignment: "center",
    				$$slots: { default: [create_default_slot_14] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stack.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stack, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stack_changes = {};

    			if (dirty & /*$$scope, currentStep, $store*/ 259) {
    				stack_changes.$$scope = { dirty, ctx };
    			}

    			stack.$set(stack_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stack, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_13.name,
    		type: "slot",
    		source: "(81:8) <Box shape=\\\"rounded\\\" class=\\\"fadeIn progressCard\\\" palette={primaryColor} padding=\\\"large\\\">",
    		ctx
    	});

    	return block;
    }

    // (95:16) <Heading is="h3"  palette="dark">
    function create_default_slot_12(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Analyzing each song");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_12.name,
    		type: "slot",
    		source: "(95:16) <Heading is=\\\"h3\\\"  palette=\\\"dark\\\">",
    		ctx
    	});

    	return block;
    }

    // (99:42) 
    function create_if_block_4$1(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_11] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(99:42) ",
    		ctx
    	});

    	return block;
    }

    // (97:16) {#if currentStep=="group"}
    function create_if_block_3$1(ctx) {
    	let spinner;
    	let current;
    	spinner = new Spinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(97:16) {#if currentStep==\\\"group\\\"}",
    		ctx
    	});

    	return block;
    }

    // (100:20) <Text>
    function create_default_slot_11(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Beep boop done 👩‍💻");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_11.name,
    		type: "slot",
    		source: "(100:20) <Text>",
    		ctx
    	});

    	return block;
    }

    // (94:12) <Stack alignment="center">
    function create_default_slot_10(ctx) {
    	let heading;
    	let t0;
    	let spacer;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	heading = new Heading({
    			props: {
    				is: "h3",
    				palette: "dark",
    				$$slots: { default: [create_default_slot_12] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	spacer = new Spacer({
    			props: { spacing: "large" },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block_3$1, create_if_block_4$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*currentStep*/ ctx[0] == "group") return 0;
    		if (/*$store*/ ctx[1].features) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_1(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			create_component(heading.$$.fragment);
    			t0 = space();
    			create_component(spacer.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(heading, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(spacer, target, anchor);
    			insert_dev(target, t1, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const heading_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				heading_changes.$$scope = { dirty, ctx };
    			}

    			heading.$set(heading_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(heading.$$.fragment, local);
    			transition_in(spacer.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(heading.$$.fragment, local);
    			transition_out(spacer.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(heading, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(spacer, detaching);
    			if (detaching) detach_dev(t1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_10.name,
    		type: "slot",
    		source: "(94:12) <Stack alignment=\\\"center\\\">",
    		ctx
    	});

    	return block;
    }

    // (93:8) <Box shape="rounded" class="fadeIn progressCard" palette={steps.group ? primaryColor : "dark"} padding="large">
    function create_default_slot_9(ctx) {
    	let stack;
    	let current;

    	stack = new Stack({
    			props: {
    				alignment: "center",
    				$$slots: { default: [create_default_slot_10] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stack.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stack, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stack_changes = {};

    			if (dirty & /*$$scope, currentStep, $store*/ 259) {
    				stack_changes.$$scope = { dirty, ctx };
    			}

    			stack.$set(stack_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stack, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_9.name,
    		type: "slot",
    		source: "(93:8) <Box shape=\\\"rounded\\\" class=\\\"fadeIn progressCard\\\" palette={steps.group ? primaryColor : \\\"dark\\\"} padding=\\\"large\\\">",
    		ctx
    	});

    	return block;
    }

    // (107:16) <Heading is="h3" palette="dark">
    function create_default_slot_8$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Matching music with vibes");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8$1.name,
    		type: "slot",
    		source: "(107:16) <Heading is=\\\"h3\\\" palette=\\\"dark\\\">",
    		ctx
    	});

    	return block;
    }

    // (111:43) 
    function create_if_block_2$1(ctx) {
    	let text_1;
    	let current;

    	text_1 = new Text({
    			props: {
    				$$slots: { default: [create_default_slot_7$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const text_1_changes = {};

    			if (dirty & /*$$scope, $store*/ 258) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(111:43) ",
    		ctx
    	});

    	return block;
    }

    // (109:16) {#if currentStep=="createPlaylists"}
    function create_if_block_1$1(ctx) {
    	let spinner;
    	let current;
    	spinner = new Spinner({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(109:16) {#if currentStep==\\\"createPlaylists\\\"}",
    		ctx
    	});

    	return block;
    }

    // (112:20) <Text>
    function create_default_slot_7$2(ctx) {
    	let t0_value = Object.keys(/*$store*/ ctx[1].playlists).length + "";
    	let t0;
    	let t1;

    	const block = {
    		c: function create() {
    			t0 = text(t0_value);
    			t1 = text(" 💅🏽 vibes found");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$store*/ 2 && t0_value !== (t0_value = Object.keys(/*$store*/ ctx[1].playlists).length + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$2.name,
    		type: "slot",
    		source: "(112:20) <Text>",
    		ctx
    	});

    	return block;
    }

    // (106:12) <Stack alignment="center">
    function create_default_slot_6$2(ctx) {
    	let heading;
    	let t0;
    	let spacer;
    	let t1;
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;

    	heading = new Heading({
    			props: {
    				is: "h3",
    				palette: "dark",
    				$$slots: { default: [create_default_slot_8$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	spacer = new Spacer({
    			props: { spacing: "large" },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block_1$1, create_if_block_2$1];
    	const if_blocks = [];

    	function select_block_type_2(ctx, dirty) {
    		if (/*currentStep*/ ctx[0] == "createPlaylists") return 0;
    		if (/*$store*/ ctx[1].playlists) return 1;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type_2(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	const block = {
    		c: function create() {
    			create_component(heading.$$.fragment);
    			t0 = space();
    			create_component(spacer.$$.fragment);
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			mount_component(heading, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(spacer, target, anchor);
    			insert_dev(target, t1, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(target, anchor);
    			}

    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const heading_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				heading_changes.$$scope = { dirty, ctx };
    			}

    			heading.$set(heading_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_2(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				} else {
    					if_block = null;
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(heading.$$.fragment, local);
    			transition_in(spacer.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(heading.$$.fragment, local);
    			transition_out(spacer.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(heading, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(spacer, detaching);
    			if (detaching) detach_dev(t1);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d(detaching);
    			}

    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$2.name,
    		type: "slot",
    		source: "(106:12) <Stack alignment=\\\"center\\\">",
    		ctx
    	});

    	return block;
    }

    // (105:8) <Box shape="rounded" class="fadeIn progressCard" palette={steps.createPlaylists ? primaryColor : "dark"} padding="large">
    function create_default_slot_5$2(ctx) {
    	let stack;
    	let current;

    	stack = new Stack({
    			props: {
    				alignment: "center",
    				$$slots: { default: [create_default_slot_6$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stack.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stack, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stack_changes = {};

    			if (dirty & /*$$scope, currentStep, $store*/ 259) {
    				stack_changes.$$scope = { dirty, ctx };
    			}

    			stack.$set(stack_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stack, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$2.name,
    		type: "slot",
    		source: "(105:8) <Box shape=\\\"rounded\\\" class=\\\"fadeIn progressCard\\\" palette={steps.createPlaylists ? primaryColor : \\\"dark\\\"} padding=\\\"large\\\">",
    		ctx
    	});

    	return block;
    }

    // (75:4) <Grid.Container         alignment_x="center"         points={["mobile:1", "3"]}         orientation={["tablet:horizatonal", "desktop:horizontal", "widescreen:horizontal"]}         spacing="medium">
    function create_default_slot_4$2(ctx) {
    	let box0;
    	let t0;
    	let box1;
    	let t1;
    	let box2;
    	let current;

    	box0 = new Box({
    			props: {
    				shape: "rounded",
    				class: "fadeIn progressCard",
    				palette: /*primaryColor*/ ctx[4],
    				padding: "large",
    				$$slots: { default: [create_default_slot_13] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	box1 = new Box({
    			props: {
    				shape: "rounded",
    				class: "fadeIn progressCard",
    				palette: /*steps*/ ctx[2].group
    				? /*primaryColor*/ ctx[4]
    				: "dark",
    				padding: "large",
    				$$slots: { default: [create_default_slot_9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	box2 = new Box({
    			props: {
    				shape: "rounded",
    				class: "fadeIn progressCard",
    				palette: /*steps*/ ctx[2].createPlaylists
    				? /*primaryColor*/ ctx[4]
    				: "dark",
    				padding: "large",
    				$$slots: { default: [create_default_slot_5$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(box0.$$.fragment);
    			t0 = space();
    			create_component(box1.$$.fragment);
    			t1 = space();
    			create_component(box2.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(box0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(box1, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(box2, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const box0_changes = {};

    			if (dirty & /*$$scope, currentStep, $store*/ 259) {
    				box0_changes.$$scope = { dirty, ctx };
    			}

    			box0.$set(box0_changes);
    			const box1_changes = {};

    			if (dirty & /*steps*/ 4) box1_changes.palette = /*steps*/ ctx[2].group
    			? /*primaryColor*/ ctx[4]
    			: "dark";

    			if (dirty & /*$$scope, currentStep, $store*/ 259) {
    				box1_changes.$$scope = { dirty, ctx };
    			}

    			box1.$set(box1_changes);
    			const box2_changes = {};

    			if (dirty & /*steps*/ 4) box2_changes.palette = /*steps*/ ctx[2].createPlaylists
    			? /*primaryColor*/ ctx[4]
    			: "dark";

    			if (dirty & /*$$scope, currentStep, $store*/ 259) {
    				box2_changes.$$scope = { dirty, ctx };
    			}

    			box2.$set(box2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(box0.$$.fragment, local);
    			transition_in(box1.$$.fragment, local);
    			transition_in(box2.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(box0.$$.fragment, local);
    			transition_out(box1.$$.fragment, local);
    			transition_out(box2.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(box0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(box1, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(box2, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$2.name,
    		type: "slot",
    		source: "(75:4) <Grid.Container         alignment_x=\\\"center\\\"         points={[\\\"mobile:1\\\", \\\"3\\\"]}         orientation={[\\\"tablet:horizatonal\\\", \\\"desktop:horizontal\\\", \\\"widescreen:horizontal\\\"]}         spacing=\\\"medium\\\">",
    		ctx
    	});

    	return block;
    }

    // (133:4) {:else}
    function create_else_block$4(ctx) {
    	let spacer;
    	let t;
    	let button;
    	let current;

    	spacer = new Spacer({
    			props: { spacing: "small" },
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				class: "browse-playlists padding",
    				size: "large",
    				palette: "affirmative",
    				disabled: !/*$store*/ ctx[1].playlists || Object.keys(/*$store*/ ctx[1].playlists).length == 0,
    				$$slots: { default: [create_default_slot_3$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler_1*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(spacer.$$.fragment);
    			t = space();
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spacer, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};
    			if (dirty & /*$store*/ 2) button_changes.disabled = !/*$store*/ ctx[1].playlists || Object.keys(/*$store*/ ctx[1].playlists).length == 0;

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spacer.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spacer.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spacer, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(133:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (125:4) {#if error}
    function create_if_block$5(ctx) {
    	let stack;
    	let current;

    	stack = new Stack({
    			props: {
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stack.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stack, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stack_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				stack_changes.$$scope = { dirty, ctx };
    			}

    			stack.$set(stack_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stack, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(125:4) {#if error}",
    		ctx
    	});

    	return block;
    }

    // (135:12) <Button                 class="browse-playlists padding"                 size="large"                  palette="affirmative"                 disabled={!$store.playlists || Object.keys($store.playlists).length == 0}                 on:click={() => router.goto("/auth/playlists")}             >
    function create_default_slot_3$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Browse playlists");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$3.name,
    		type: "slot",
    		source: "(135:12) <Button                 class=\\\"browse-playlists padding\\\"                 size=\\\"large\\\"                  palette=\\\"affirmative\\\"                 disabled={!$store.playlists || Object.keys($store.playlists).length == 0}                 on:click={() => router.goto(\\\"/auth/playlists\\\")}             >",
    		ctx
    	});

    	return block;
    }

    // (127:12) <Heading is="h2">
    function create_default_slot_2$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Uh oh, something failed!");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$3.name,
    		type: "slot",
    		source: "(127:12) <Heading is=\\\"h2\\\">",
    		ctx
    	});

    	return block;
    }

    // (131:12) <Button class="padding" size="large" palette="negative" on:click={() => window.location.href=""}>
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Try again");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(131:12) <Button class=\\\"padding\\\" size=\\\"large\\\" palette=\\\"negative\\\" on:click={() => window.location.href=\\\"\\\"}>",
    		ctx
    	});

    	return block;
    }

    // (126:8) <Stack>
    function create_default_slot$4(ctx) {
    	let heading;
    	let t0;
    	let spacer;
    	let t1;
    	let button;
    	let current;

    	heading = new Heading({
    			props: {
    				is: "h2",
    				$$slots: { default: [create_default_slot_2$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	spacer = new Spacer({
    			props: { spacing: "large" },
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				class: "padding",
    				size: "large",
    				palette: "negative",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[5]);

    	const block = {
    		c: function create() {
    			create_component(heading.$$.fragment);
    			t0 = space();
    			create_component(spacer.$$.fragment);
    			t1 = space();
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(heading, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(spacer, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const heading_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				heading_changes.$$scope = { dirty, ctx };
    			}

    			heading.$set(heading_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope*/ 256) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(heading.$$.fragment, local);
    			transition_in(spacer.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(heading.$$.fragment, local);
    			transition_out(spacer.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(heading, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(spacer, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(126:8) <Stack>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let spacer0;
    	let t2;
    	let grid_container;
    	let t3;
    	let spacer1;
    	let t4;
    	let current_block_type_index;
    	let if_block;
    	let current;

    	spacer0 = new Spacer({
    			props: { spacing: "large" },
    			$$inline: true
    		});

    	grid_container = new GridContainer({
    			props: {
    				alignment_x: "center",
    				points: ["mobile:1", "3"],
    				orientation: ["tablet:horizatonal", "desktop:horizontal", "widescreen:horizontal"],
    				spacing: "medium",
    				$$slots: { default: [create_default_slot_4$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	spacer1 = new Spacer({
    			props: { spacing: "medium" },
    			$$inline: true
    		});

    	const if_block_creators = [create_if_block$5, create_else_block$4];
    	const if_blocks = [];

    	function select_block_type_3(ctx, dirty) {
    		if (/*error*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type_3(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Analyzing your music 🎵";
    			t1 = space();
    			create_component(spacer0.$$.fragment);
    			t2 = space();
    			create_component(grid_container.$$.fragment);
    			t3 = space();
    			create_component(spacer1.$$.fragment);
    			t4 = space();
    			if_block.c();
    			attr_dev(h1, "class", "analyze");
    			add_location(h1, file$4, 70, 4, 2323);
    			attr_dev(div, "class", "center padding");
    			add_location(div, file$4, 69, 0, 2290);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			mount_component(spacer0, div, null);
    			append_dev(div, t2);
    			mount_component(grid_container, div, null);
    			append_dev(div, t3);
    			mount_component(spacer1, div, null);
    			append_dev(div, t4);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const grid_container_changes = {};

    			if (dirty & /*$$scope, steps, currentStep, $store*/ 263) {
    				grid_container_changes.$$scope = { dirty, ctx };
    			}

    			grid_container.$set(grid_container_changes);
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_3(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spacer0.$$.fragment, local);
    			transition_in(grid_container.$$.fragment, local);
    			transition_in(spacer1.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spacer0.$$.fragment, local);
    			transition_out(grid_container.$$.fragment, local);
    			transition_out(spacer1.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(spacer0);
    			destroy_component(grid_container);
    			destroy_component(spacer1);
    			if_blocks[current_block_type_index].d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let currentStep;
    	let $store;
    	validate_store(store, 'store');
    	component_subscribe($$self, store, $$value => $$invalidate(1, $store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MyMusic', slots, []);

    	let steps = {
    		getMusic: true,
    		group: false,
    		createPlaylists: false
    	};

    	let primaryColor = "light";
    	let error;

    	const playlistCounter = () => Object.values($store.playlists).reduce(
    		(sum, current) => {
    			sum += current.length;
    			return sum;
    		},
    		0
    	);

    	onMount(() => {
    		mixpanel_cjs.track("Logged in");

    		// get all music from 10 years
    		getSongsUntil($store.token, 10 * 365).then(songs => {
    			set_store_value(store, $store.songs = songs, $store);
    			$$invalidate(2, steps.group = true, steps);
    			$$invalidate(0, currentStep = "group");
    			return songs;
    		}).then(songs => get_song_features($store.token, songs.map(s => s.id))).then(feats => {
    			set_store_value(
    				store,
    				$store.songs = $store.songs.map(song => {
    					song.feats = feats[song.id];
    					return song;
    				}),
    				$store
    			);

    			return postRequest($store.BASE_URL + `find-avg-features`, filterSongsUntilDaysAgo($store.songs, 2 * 365)); // last two years
    			// $store.songs.slice(0, Math.round($store.songs.length / 2))
    		}).then(data => data.json()).then(data => new Promise(r => setTimeout(() => r(data), 2000))).then(feats => {
    			// @ts-ignore
    			set_store_value(store, $store.features = feats, $store);

    			$$invalidate(2, steps.createPlaylists = true, steps);
    			$$invalidate(0, currentStep = "createPlaylists");
    		}).then(() => postRequest($store.BASE_URL + `create-playlists`, {
    			songs: $store.songs,
    			centers: $store.features
    		})).then(data => data.json()).then(data => new Promise(r => setTimeout(() => r(data), 3500))).then(lists => {
    			// @ts-ignore
    			set_store_value(store, $store.playlists = lists, $store);

    			$$invalidate(0, currentStep = "");
    		}).catch(() => $$invalidate(3, error = true));
    	});

    	const writable_props = [];

    	Object_1$3.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MyMusic> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => window.location.href = "";
    	const click_handler_1 = () => f.goto("/auth/playlists");

    	$$self.$capture_state = () => ({
    		Button,
    		Spacer,
    		Spinner,
    		Stack,
    		Box,
    		Text,
    		Heading,
    		onMount,
    		store,
    		Grid,
    		router: f,
    		getSongsUntil,
    		postRequest,
    		get_song_features,
    		filterSongsUntilDaysAgo,
    		mixpanel: mixpanel_cjs,
    		steps,
    		primaryColor,
    		error,
    		playlistCounter,
    		currentStep,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('steps' in $$props) $$invalidate(2, steps = $$props.steps);
    		if ('primaryColor' in $$props) $$invalidate(4, primaryColor = $$props.primaryColor);
    		if ('error' in $$props) $$invalidate(3, error = $$props.error);
    		if ('currentStep' in $$props) $$invalidate(0, currentStep = $$props.currentStep);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*currentStep, $store*/ 3) {
    			// @ts-ignore
    			!currentStep && Object.keys($store.playlists).length > 0 && party.confetti(document.querySelector(".browse-playlists"), {
    				count: party.variation.range(30, 50),
    				spread: 55
    			});
    		}
    	};

    	$$invalidate(0, currentStep = "grid");

    	return [
    		currentStep,
    		$store,
    		steps,
    		error,
    		primaryColor,
    		click_handler,
    		click_handler_1
    	];
    }

    class MyMusic extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MyMusic",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/Transition.svelte generated by Svelte v3.42.5 */
    const file$3 = "src/Transition.svelte";

    // (6:0) {#key $router.path}
    function create_key_block(ctx) {
    	let main;
    	let main_intro;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[2].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[1], null);

    	const block = {
    		c: function create() {
    			main = element("main");
    			if (default_slot) default_slot.c();
    			add_location(main, file$3, 6, 4, 122);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);

    			if (default_slot) {
    				default_slot.m(main, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[1], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			if (!main_intro) {
    				add_render_callback(() => {
    					main_intro = create_in_transition(main, fade, { duration: 700 });
    					main_intro.start();
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_key_block.name,
    		type: "key",
    		source: "(6:0) {#key $router.path}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let previous_key = /*$router*/ ctx[0].path;
    	let key_block_anchor;
    	let current;
    	let key_block = create_key_block(ctx);

    	const block = {
    		c: function create() {
    			key_block.c();
    			key_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			key_block.m(target, anchor);
    			insert_dev(target, key_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$router*/ 1 && safe_not_equal(previous_key, previous_key = /*$router*/ ctx[0].path)) {
    				group_outros();
    				transition_out(key_block, 1, 1, noop);
    				check_outros();
    				key_block = create_key_block(ctx);
    				key_block.c();
    				transition_in(key_block);
    				key_block.m(key_block_anchor.parentNode, key_block_anchor);
    			} else {
    				key_block.p(ctx, dirty);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(key_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(key_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(key_block_anchor);
    			key_block.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $router;
    	validate_store(f, 'router');
    	component_subscribe($$self, f, $$value => $$invalidate(0, $router = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Transition', slots, ['default']);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Transition> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ router: f, fade, $router });
    	return [$router, $$scope, slots];
    }

    class Transition extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Transition",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/AuthGuard.svelte generated by Svelte v3.42.5 */

    const { Object: Object_1$2 } = globals;
    const get_notAuuthed_slot_changes = dirty => ({});
    const get_notAuuthed_slot_context = ctx => ({});
    const get_authed_slot_changes = dirty => ({});
    const get_authed_slot_context = ctx => ({});

    // (30:0) {:else}
    function create_else_block$3(ctx) {
    	let current;
    	const notAuuthed_slot_template = /*#slots*/ ctx[2].notAuuthed;
    	const notAuuthed_slot = create_slot(notAuuthed_slot_template, ctx, /*$$scope*/ ctx[1], get_notAuuthed_slot_context);

    	const block = {
    		c: function create() {
    			if (notAuuthed_slot) notAuuthed_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (notAuuthed_slot) {
    				notAuuthed_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (notAuuthed_slot) {
    				if (notAuuthed_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						notAuuthed_slot,
    						notAuuthed_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(notAuuthed_slot_template, /*$$scope*/ ctx[1], dirty, get_notAuuthed_slot_changes),
    						get_notAuuthed_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notAuuthed_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notAuuthed_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (notAuuthed_slot) notAuuthed_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(30:0) {:else}",
    		ctx
    	});

    	return block;
    }

    // (28:0) {#if foundToken}
    function create_if_block$4(ctx) {
    	let current;
    	const authed_slot_template = /*#slots*/ ctx[2].authed;
    	const authed_slot = create_slot(authed_slot_template, ctx, /*$$scope*/ ctx[1], get_authed_slot_context);

    	const block = {
    		c: function create() {
    			if (authed_slot) authed_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (authed_slot) {
    				authed_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (authed_slot) {
    				if (authed_slot.p && (!current || dirty & /*$$scope*/ 2)) {
    					update_slot_base(
    						authed_slot,
    						authed_slot_template,
    						ctx,
    						/*$$scope*/ ctx[1],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[1])
    						: get_slot_changes(authed_slot_template, /*$$scope*/ ctx[1], dirty, get_authed_slot_changes),
    						get_authed_slot_context
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(authed_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(authed_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (authed_slot) authed_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(28:0) {#if foundToken}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$4, create_else_block$3];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*foundToken*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $store;
    	validate_store(store, 'store');
    	component_subscribe($$self, store, $$value => $$invalidate(3, $store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AuthGuard', slots, ['authed','notAuuthed']);
    	let foundToken = !!$store.token;

    	// console.log(route.params)
    	onMount(() => {
    		// foundToken = document.cookie.split(";")
    		// .find(cookie => cookie.includes('token='));
    		// if (foundToken) {
    		// 	$store.token = foundToken.replace("token=", "");
    		// }
    		if (!foundToken) {
    			const urlSearchParams = new URLSearchParams(window.location.search);
    			const params = Object.fromEntries(urlSearchParams.entries());

    			if ('token' in params) {
    				set_store_value(store, $store.token = params.token, $store);
    				$$invalidate(0, foundToken = true);
    			}
    		}
    	});

    	const writable_props = [];

    	Object_1$2.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AuthGuard> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('$$scope' in $$props) $$invalidate(1, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ store, onMount, foundToken, $store });

    	$$self.$inject_state = $$props => {
    		if ('foundToken' in $$props) $$invalidate(0, foundToken = $$props.foundToken);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [foundToken, $$scope, slots];
    }

    class AuthGuard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AuthGuard",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/Components/embed.svelte generated by Svelte v3.42.5 */
    const file$2 = "src/Components/embed.svelte";

    // (26:4) {:else}
    function create_else_block$2(ctx) {
    	let stack;
    	let current;

    	stack = new Stack({
    			props: {
    				orientation: "horizontal",
    				class: "playholder",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stack.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stack, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stack_changes = {};

    			if (dirty & /*$$scope, info*/ 258) {
    				stack_changes.$$scope = { dirty, ctx };
    			}

    			stack.$set(stack_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stack, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(26:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (22:4) {#if clicked}
    function create_if_block$3(ctx) {
    	let iframe;
    	let iframe_src_value;
    	let t;
    	let spinner;
    	let current;

    	spinner = new Spinner({
    			props: { class: "iframe-spinner center" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			iframe = element("iframe");
    			t = space();
    			create_component(spinner.$$.fragment);
    			attr_dev(iframe, "class", "center svelte-1t8kzwg");
    			if (!src_url_equal(iframe.src, iframe_src_value = `https://open.spotify.com/embed/track/${/*songId*/ ctx[0]}`)) attr_dev(iframe, "src", iframe_src_value);
    			attr_dev(iframe, "width", /*width*/ ctx[2]);
    			attr_dev(iframe, "height", "100");
    			attr_dev(iframe, "frameborder", "0");
    			attr_dev(iframe, "allowtransparency", "true");
    			attr_dev(iframe, "allow", "encrypted-media");
    			attr_dev(iframe, "title", "Song sample");
    			add_location(iframe, file$2, 22, 8, 652);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, iframe, anchor);
    			/*iframe_binding*/ ctx[6](iframe);
    			insert_dev(target, t, anchor);
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*songId*/ 1 && !src_url_equal(iframe.src, iframe_src_value = `https://open.spotify.com/embed/track/${/*songId*/ ctx[0]}`)) {
    				attr_dev(iframe, "src", iframe_src_value);
    			}

    			if (!current || dirty & /*width*/ 4) {
    				attr_dev(iframe, "width", /*width*/ ctx[2]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(iframe);
    			/*iframe_binding*/ ctx[6](null);
    			if (detaching) detach_dev(t);
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(22:4) {#if clicked}",
    		ctx
    	});

    	return block;
    }

    // (30:16) <Heading class="song-title" align="left" as="h4" is="strong">
    function create_default_slot_3$2(ctx) {
    	let t_value = /*shortenString*/ ctx[5](/*info*/ ctx[1].name) + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t_value !== (t_value = /*shortenString*/ ctx[5](/*info*/ ctx[1].name) + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$2.name,
    		type: "slot",
    		source: "(30:16) <Heading class=\\\"song-title\\\" align=\\\"left\\\" as=\\\"h4\\\" is=\\\"strong\\\">",
    		ctx
    	});

    	return block;
    }

    // (31:16) <Text class="song-artist" align="left">
    function create_default_slot_2$2(ctx) {
    	let t_value = /*info*/ ctx[1].artist + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*info*/ 2 && t_value !== (t_value = /*info*/ ctx[1].artist + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(31:16) <Text class=\\\"song-artist\\\" align=\\\"left\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:12) <Stack padding_left="large">
    function create_default_slot_1$2(ctx) {
    	let heading;
    	let t;
    	let text_1;
    	let current;

    	heading = new Heading({
    			props: {
    				class: "song-title",
    				align: "left",
    				as: "h4",
    				is: "strong",
    				$$slots: { default: [create_default_slot_3$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	text_1 = new Text({
    			props: {
    				class: "song-artist",
    				align: "left",
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(heading.$$.fragment);
    			t = space();
    			create_component(text_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(heading, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(text_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const heading_changes = {};

    			if (dirty & /*$$scope, info*/ 258) {
    				heading_changes.$$scope = { dirty, ctx };
    			}

    			heading.$set(heading_changes);
    			const text_1_changes = {};

    			if (dirty & /*$$scope, info*/ 258) {
    				text_1_changes.$$scope = { dirty, ctx };
    			}

    			text_1.$set(text_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(heading.$$.fragment, local);
    			transition_in(text_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(heading.$$.fragment, local);
    			transition_out(text_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(heading, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(text_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(29:12) <Stack padding_left=\\\"large\\\">",
    		ctx
    	});

    	return block;
    }

    // (27:8) <Stack orientation="horizontal" class="playholder" >
    function create_default_slot$3(ctx) {
    	let img;
    	let img_src_value;
    	let img_alt_value;
    	let t;
    	let stack;
    	let current;

    	stack = new Stack({
    			props: {
    				padding_left: "large",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			img = element("img");
    			t = space();
    			create_component(stack.$$.fragment);
    			if (!src_url_equal(img.src, img_src_value = /*info*/ ctx[1].img)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", img_alt_value = `${/*info*/ ctx[1].name} album art`);
    			attr_dev(img, "class", "svelte-1t8kzwg");
    			add_location(img, file$2, 27, 12, 1024);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(stack, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty & /*info*/ 2 && !src_url_equal(img.src, img_src_value = /*info*/ ctx[1].img)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (!current || dirty & /*info*/ 2 && img_alt_value !== (img_alt_value = `${/*info*/ ctx[1].name} album art`)) {
    				attr_dev(img, "alt", img_alt_value);
    			}

    			const stack_changes = {};

    			if (dirty & /*$$scope, info*/ 258) {
    				stack_changes.$$scope = { dirty, ctx };
    			}

    			stack.$set(stack_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t);
    			destroy_component(stack, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(27:8) <Stack orientation=\\\"horizontal\\\" class=\\\"playholder\\\" >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let current;
    	let mounted;
    	let dispose;
    	const if_block_creators = [create_if_block$3, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*clicked*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block.c();
    			attr_dev(div, "class", "fadeIn svelte-1t8kzwg");
    			attr_dev(div, "tabindex", "0");
    			add_location(div, file$2, 20, 0, 562);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_blocks[current_block_type_index].m(div, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*click_handler*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(div, null);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_blocks[current_block_type_index].d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Embed', slots, []);
    	let { songId } = $$props;
    	let { info } = $$props;
    	let { width } = $$props;
    	let iframeComponent;
    	let clicked;

    	const shortenString = string => string.length > ("I Know What You Did Last").length
    	? string.slice(0, string.length - 3) + "..."
    	: string;

    	const writable_props = ['songId', 'info', 'width'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Embed> was created with unknown prop '${key}'`);
    	});

    	function iframe_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			iframeComponent = $$value;
    			$$invalidate(4, iframeComponent);
    		});
    	}

    	const click_handler = () => $$invalidate(3, clicked = true);

    	$$self.$$set = $$props => {
    		if ('songId' in $$props) $$invalidate(0, songId = $$props.songId);
    		if ('info' in $$props) $$invalidate(1, info = $$props.info);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		Button,
    		Spacer,
    		Spinner,
    		Stack,
    		Grid,
    		Text,
    		Heading,
    		Box,
    		Scrollable,
    		mixpanel: mixpanel_cjs,
    		songId,
    		info,
    		width,
    		iframeComponent,
    		clicked,
    		shortenString
    	});

    	$$self.$inject_state = $$props => {
    		if ('songId' in $$props) $$invalidate(0, songId = $$props.songId);
    		if ('info' in $$props) $$invalidate(1, info = $$props.info);
    		if ('width' in $$props) $$invalidate(2, width = $$props.width);
    		if ('iframeComponent' in $$props) $$invalidate(4, iframeComponent = $$props.iframeComponent);
    		if ('clicked' in $$props) $$invalidate(3, clicked = $$props.clicked);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*clicked*/ 8) {
    			clicked && mixpanel_cjs.track("Song embed clicked");
    		}
    	};

    	return [
    		songId,
    		info,
    		width,
    		clicked,
    		iframeComponent,
    		shortenString,
    		iframe_binding,
    		click_handler
    	];
    }

    class Embed extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { songId: 0, info: 1, width: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Embed",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*songId*/ ctx[0] === undefined && !('songId' in props)) {
    			console.warn("<Embed> was created without expected prop 'songId'");
    		}

    		if (/*info*/ ctx[1] === undefined && !('info' in props)) {
    			console.warn("<Embed> was created without expected prop 'info'");
    		}

    		if (/*width*/ ctx[2] === undefined && !('width' in props)) {
    			console.warn("<Embed> was created without expected prop 'width'");
    		}
    	}

    	get songId() {
    		throw new Error("<Embed>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set songId(value) {
    		throw new Error("<Embed>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get info() {
    		throw new Error("<Embed>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set info(value) {
    		throw new Error("<Embed>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<Embed>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<Embed>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Components/Playlist.svelte generated by Svelte v3.42.5 */

    const { Object: Object_1$1 } = globals;
    const file$1 = "src/Components/Playlist.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (48:8) <Heading as="h2" align="left" class="playlist-title">
    function create_default_slot_8(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text(/*playlistTitle*/ ctx[4]);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(48:8) <Heading as=\\\"h2\\\" align=\\\"left\\\" class=\\\"playlist-title\\\">",
    		ctx
    	});

    	return block;
    }

    // (49:8) <Heading as="h3" align="left" class="playlist-count">
    function create_default_slot_7$1(ctx) {
    	let t_value = `${/*songsChosen*/ ctx[0].length} songs` + "";
    	let t;

    	const block = {
    		c: function create() {
    			t = text(t_value);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*songsChosen*/ 1 && t_value !== (t_value = `${/*songsChosen*/ ctx[0].length} songs` + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7$1.name,
    		type: "slot",
    		source: "(49:8) <Heading as=\\\"h3\\\" align=\\\"left\\\" class=\\\"playlist-count\\\">",
    		ctx
    	});

    	return block;
    }

    // (46:4) <Stack         spacing="large">
    function create_default_slot_6$1(ctx) {
    	let heading0;
    	let t;
    	let heading1;
    	let current;

    	heading0 = new Heading({
    			props: {
    				as: "h2",
    				align: "left",
    				class: "playlist-title",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	heading1 = new Heading({
    			props: {
    				as: "h3",
    				align: "left",
    				class: "playlist-count",
    				$$slots: { default: [create_default_slot_7$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(heading0.$$.fragment);
    			t = space();
    			create_component(heading1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(heading0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(heading1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const heading0_changes = {};

    			if (dirty & /*$$scope*/ 8192) {
    				heading0_changes.$$scope = { dirty, ctx };
    			}

    			heading0.$set(heading0_changes);
    			const heading1_changes = {};

    			if (dirty & /*$$scope, songsChosen*/ 8193) {
    				heading1_changes.$$scope = { dirty, ctx };
    			}

    			heading1.$set(heading1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(heading0.$$.fragment, local);
    			transition_in(heading1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(heading0.$$.fragment, local);
    			transition_out(heading1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(heading0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(heading1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(46:4) <Stack         spacing=\\\"large\\\">",
    		ctx
    	});

    	return block;
    }

    // (53:8) {#if songsChosen.length >= max_songs}
    function create_if_block_3(ctx) {
    	let button;
    	let current;

    	button = new Button({
    			props: {
    				class: "padding",
    				palette: "auto",
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*click_handler*/ ctx[8]);

    	const block = {
    		c: function create() {
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const button_changes = {};

    			if (dirty & /*$$scope, refrehing*/ 8200) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(53:8) {#if songsChosen.length >= max_songs}",
    		ctx
    	});

    	return block;
    }

    // (57:16) {:else}
    function create_else_block_1(ctx) {
    	let t0;
    	let span;

    	const block = {
    		c: function create() {
    			t0 = text("Refresh \n                    ");
    			span = element("span");
    			span.textContent = "refresh";
    			attr_dev(span, "class", "material-icons");
    			add_location(span, file$1, 58, 20, 2318);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(57:16) {:else}",
    		ctx
    	});

    	return block;
    }

    // (55:16) {#if refrehing}
    function create_if_block_4(ctx) {
    	let spinner;
    	let current;

    	spinner = new Spinner({
    			props: { size: "medium" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(55:16) {#if refrehing}",
    		ctx
    	});

    	return block;
    }

    // (54:12) <Button class="padding" palette="auto" on:click={() => generateSongs()}>
    function create_default_slot_5$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_4, create_else_block_1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*refrehing*/ ctx[3]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(54:12) <Button class=\\\"padding\\\" palette=\\\"auto\\\" on:click={() => generateSongs()}>",
    		ctx
    	});

    	return block;
    }

    // (73:12) {:else}
    function create_else_block$1(ctx) {
    	let t0;
    	let span;

    	const block = {
    		c: function create() {
    			t0 = text("Add\n                ");
    			span = element("span");
    			span.textContent = "add";
    			attr_dev(span, "class", "material-icons");
    			add_location(span, file$1, 74, 16, 2880);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(73:12) {:else}",
    		ctx
    	});

    	return block;
    }

    // (69:45) 
    function create_if_block_2(ctx) {
    	let span;

    	const block = {
    		c: function create() {
    			span = element("span");
    			span.textContent = "done";
    			attr_dev(span, "class", "material-icons");
    			add_location(span, file$1, 69, 16, 2745);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(69:45) ",
    		ctx
    	});

    	return block;
    }

    // (67:12) {#if submitting === "loading"}
    function create_if_block_1(ctx) {
    	let spinner;
    	let current;

    	spinner = new Spinner({
    			props: { size: "medium" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(67:12) {#if submitting === \\\"loading\\\"}",
    		ctx
    	});

    	return block;
    }

    // (66:8) <Button class="padding" palette={submitting === "check" ? "affirmative" : "accent"} on:click={submitPlaylist}>
    function create_default_slot_4$1(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_if_block_2, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type_1(ctx, dirty) {
    		if (/*submitting*/ ctx[2] === "loading") return 0;
    		if (/*submitting*/ ctx[2] === "check") return 1;
    		return 2;
    	}

    	current_block_type_index = select_block_type_1(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type_1(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(66:8) <Button class=\\\"padding\\\" palette={submitting === \\\"check\\\" ? \\\"affirmative\\\" : \\\"accent\\\"} on:click={submitPlaylist}>",
    		ctx
    	});

    	return block;
    }

    // (52:4) <Stack orientation="horizontal">
    function create_default_slot_3$1(ctx) {
    	let t;
    	let button;
    	let current;
    	let if_block = /*songsChosen*/ ctx[0].length >= max_songs && create_if_block_3(ctx);

    	button = new Button({
    			props: {
    				class: "padding",
    				palette: /*submitting*/ ctx[2] === "check"
    				? "affirmative"
    				: "accent",
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*submitPlaylist*/ ctx[6]);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			create_component(button.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*songsChosen*/ ctx[0].length >= max_songs) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*songsChosen*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			const button_changes = {};

    			if (dirty & /*submitting*/ 4) button_changes.palette = /*submitting*/ ctx[2] === "check"
    			? "affirmative"
    			: "accent";

    			if (dirty & /*$$scope, submitting*/ 8196) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(52:4) <Stack orientation=\\\"horizontal\\\">",
    		ctx
    	});

    	return block;
    }

    // (84:12) {#if trackInfos.length > 0}
    function create_if_block$2(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*songsChosen*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*songsChosen, trackInfos*/ 3) {
    				each_value = /*songsChosen*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(84:12) {#if trackInfos.length > 0}",
    		ctx
    	});

    	return block;
    }

    // (85:16) {#each songsChosen as song, index}
    function create_each_block$1(ctx) {
    	let embed;
    	let current;

    	embed = new Embed({
    			props: {
    				songId: /*song*/ ctx[10].id,
    				info: /*trackInfos*/ ctx[1][/*index*/ ctx[12]],
    				width: ""
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(embed.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(embed, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const embed_changes = {};
    			if (dirty & /*songsChosen*/ 1) embed_changes.songId = /*song*/ ctx[10].id;
    			if (dirty & /*trackInfos*/ 2) embed_changes.info = /*trackInfos*/ ctx[1][/*index*/ ctx[12]];
    			embed.$set(embed_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(embed.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(embed.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(embed, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(85:16) {#each songsChosen as song, index}",
    		ctx
    	});

    	return block;
    }

    // (83:8) <Stack spacing="medium">
    function create_default_slot_2$1(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*trackInfos*/ ctx[1].length > 0 && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*trackInfos*/ ctx[1].length > 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*trackInfos*/ 2) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(83:8) <Stack spacing=\\\"medium\\\">",
    		ctx
    	});

    	return block;
    }

    // (82:4) <Scrollable class="scroll">
    function create_default_slot_1$1(ctx) {
    	let stack;
    	let current;

    	stack = new Stack({
    			props: {
    				spacing: "medium",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stack.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stack, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stack_changes = {};

    			if (dirty & /*$$scope, songsChosen, trackInfos*/ 8195) {
    				stack_changes.$$scope = { dirty, ctx };
    			}

    			stack.$set(stack_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stack, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(82:4) <Scrollable class=\\\"scroll\\\">",
    		ctx
    	});

    	return block;
    }

    // (45:0) <Box tabindex="0" padding_y="huge" class="playlist-box" padding_x="large" palette="dark">
    function create_default_slot$2(ctx) {
    	let stack0;
    	let t0;
    	let spacer0;
    	let t1;
    	let stack1;
    	let t2;
    	let spacer1;
    	let t3;
    	let scrollable;
    	let current;

    	stack0 = new Stack({
    			props: {
    				spacing: "large",
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	spacer0 = new Spacer({
    			props: { spacing: "medium" },
    			$$inline: true
    		});

    	stack1 = new Stack({
    			props: {
    				orientation: "horizontal",
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	spacer1 = new Spacer({
    			props: { spacing: "medium" },
    			$$inline: true
    		});

    	scrollable = new Scrollable({
    			props: {
    				class: "scroll",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stack0.$$.fragment);
    			t0 = space();
    			create_component(spacer0.$$.fragment);
    			t1 = space();
    			create_component(stack1.$$.fragment);
    			t2 = space();
    			create_component(spacer1.$$.fragment);
    			t3 = space();
    			create_component(scrollable.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stack0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(spacer0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(stack1, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(spacer1, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(scrollable, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stack0_changes = {};

    			if (dirty & /*$$scope, songsChosen*/ 8193) {
    				stack0_changes.$$scope = { dirty, ctx };
    			}

    			stack0.$set(stack0_changes);
    			const stack1_changes = {};

    			if (dirty & /*$$scope, submitting, refrehing, songsChosen*/ 8205) {
    				stack1_changes.$$scope = { dirty, ctx };
    			}

    			stack1.$set(stack1_changes);
    			const scrollable_changes = {};

    			if (dirty & /*$$scope, songsChosen, trackInfos*/ 8195) {
    				scrollable_changes.$$scope = { dirty, ctx };
    			}

    			scrollable.$set(scrollable_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack0.$$.fragment, local);
    			transition_in(spacer0.$$.fragment, local);
    			transition_in(stack1.$$.fragment, local);
    			transition_in(spacer1.$$.fragment, local);
    			transition_in(scrollable.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack0.$$.fragment, local);
    			transition_out(spacer0.$$.fragment, local);
    			transition_out(stack1.$$.fragment, local);
    			transition_out(spacer1.$$.fragment, local);
    			transition_out(scrollable.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stack0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(spacer0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(stack1, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(spacer1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(scrollable, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(45:0) <Box tabindex=\\\"0\\\" padding_y=\\\"huge\\\" class=\\\"playlist-box\\\" padding_x=\\\"large\\\" palette=\\\"dark\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let box;
    	let current;

    	box = new Box({
    			props: {
    				tabindex: "0",
    				padding_y: "huge",
    				class: "playlist-box",
    				padding_x: "large",
    				palette: "dark",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(box.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(box, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const box_changes = {};

    			if (dirty & /*$$scope, songsChosen, trackInfos, submitting, refrehing*/ 8207) {
    				box_changes.$$scope = { dirty, ctx };
    			}

    			box.$set(box_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(box.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(box.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(box, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const max_songs = 25;

    function shuffleArray(_array) {
    	let array = [..._array];

    	for (var i = array.length - 1; i > 0; i--) {
    		var j = Math.floor(Math.random() * (i + 1));
    		var temp = array[i];
    		array[i] = array[j];
    		array[j] = temp;
    	}

    	return array;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let $store;
    	validate_store(store, 'store');
    	component_subscribe($$self, store, $$value => $$invalidate(9, $store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Playlist', slots, []);
    	let { playlist_id } = $$props;
    	const playlistTitle = `Mix #${Object.keys($store.playlists).findIndex(i => i === playlist_id) + 1}`;
    	let songsChosen = [];
    	let trackInfos = [];
    	let submitting;
    	let refrehing;

    	const generateSongs = async (mounting = false) => {
    		$$invalidate(3, refrehing = true);
    		$$invalidate(0, songsChosen = shuffleArray($store.playlists[playlist_id]).slice(0, max_songs));
    		$$invalidate(1, trackInfos = await getTracksInfo($store.token, songsChosen.map(s => s.id)));
    		!mounting && toast.push('New songs found');
    		setTimeout(() => $$invalidate(3, refrehing = false), 500);
    	};

    	const submitPlaylist = () => {
    		$$invalidate(2, submitting = "loading");
    		mixpanel_cjs.track("Added playlist");

    		postRequest($store.BASE_URL + `submit-playlist?token=${$store.token}&name=${playlistTitle}`, songsChosen.map(s => s.id)).then(() => {
    			$$invalidate(2, submitting = "check");
    			setTimeout(() => $$invalidate(2, submitting = ""), 2000);
    			toast.push('Playlist created in Spotify');
    		});
    	};

    	onMount(() => generateSongs(true));
    	const writable_props = ['playlist_id'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Playlist> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => generateSongs();

    	$$self.$$set = $$props => {
    		if ('playlist_id' in $$props) $$invalidate(7, playlist_id = $$props.playlist_id);
    	};

    	$$self.$capture_state = () => ({
    		Button,
    		Spacer,
    		Spinner,
    		Stack,
    		Heading,
    		Box,
    		Scrollable,
    		onMount,
    		getTracksInfo,
    		postRequest,
    		toast,
    		mixpanel: mixpanel_cjs,
    		Embed,
    		store,
    		playlist_id,
    		shuffleArray,
    		max_songs,
    		playlistTitle,
    		songsChosen,
    		trackInfos,
    		submitting,
    		refrehing,
    		generateSongs,
    		submitPlaylist,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('playlist_id' in $$props) $$invalidate(7, playlist_id = $$props.playlist_id);
    		if ('songsChosen' in $$props) $$invalidate(0, songsChosen = $$props.songsChosen);
    		if ('trackInfos' in $$props) $$invalidate(1, trackInfos = $$props.trackInfos);
    		if ('submitting' in $$props) $$invalidate(2, submitting = $$props.submitting);
    		if ('refrehing' in $$props) $$invalidate(3, refrehing = $$props.refrehing);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		songsChosen,
    		trackInfos,
    		submitting,
    		refrehing,
    		playlistTitle,
    		generateSongs,
    		submitPlaylist,
    		playlist_id,
    		click_handler
    	];
    }

    class Playlist extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, { playlist_id: 7 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Playlist",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*playlist_id*/ ctx[7] === undefined && !('playlist_id' in props)) {
    			console.warn("<Playlist> was created without expected prop 'playlist_id'");
    		}
    	}

    	get playlist_id() {
    		throw new Error("<Playlist>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set playlist_id(value) {
    		throw new Error("<Playlist>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Pages/Playlists.svelte generated by Svelte v3.42.5 */

    const { Object: Object_1 } = globals;

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    // (11:8) {#if $store.playlists[playlist_id].length >= min_playlist_size}
    function create_if_block$1(ctx) {
    	let playlist;
    	let current;

    	playlist = new Playlist({
    			props: { playlist_id: /*playlist_id*/ ctx[1] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(playlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(playlist, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const playlist_changes = {};
    			if (dirty & /*$store*/ 1) playlist_changes.playlist_id = /*playlist_id*/ ctx[1];
    			playlist.$set(playlist_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(playlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(playlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(11:8) {#if $store.playlists[playlist_id].length >= min_playlist_size}",
    		ctx
    	});

    	return block;
    }

    // (10:4) {#each Object.keys($store.playlists) as playlist_id}
    function create_each_block(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*$store*/ ctx[0].playlists[/*playlist_id*/ ctx[1]].length >= min_playlist_size && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*$store*/ ctx[0].playlists[/*playlist_id*/ ctx[1]].length >= min_playlist_size) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$store*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(10:4) {#each Object.keys($store.playlists) as playlist_id}",
    		ctx
    	});

    	return block;
    }

    // (9:0) <Stack spacing="large" padding_y="large" padding_x="mobile:medium">
    function create_default_slot$1(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = Object.keys(/*$store*/ ctx[0].playlists);
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*Object, $store, min_playlist_size*/ 1) {
    				each_value = Object.keys(/*$store*/ ctx[0].playlists);
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(9:0) <Stack spacing=\\\"large\\\" padding_y=\\\"large\\\" padding_x=\\\"mobile:medium\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let stack;
    	let current;

    	stack = new Stack({
    			props: {
    				spacing: "large",
    				padding_y: "large",
    				padding_x: "mobile:medium",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stack.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(stack, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const stack_changes = {};

    			if (dirty & /*$$scope, $store*/ 17) {
    				stack_changes.$$scope = { dirty, ctx };
    			}

    			stack.$set(stack_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stack, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const min_playlist_size = 5;

    function instance$1($$self, $$props, $$invalidate) {
    	let $store;
    	validate_store(store, 'store');
    	component_subscribe($$self, store, $$value => $$invalidate(0, $store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Playlists', slots, []);
    	mixpanel_cjs.track("Browsed playlists");
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Playlists> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Stack,
    		store,
    		Playlist,
    		mixpanel: mixpanel_cjs,
    		min_playlist_size,
    		$store
    	});

    	return [$store];
    }

    class Playlists extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Playlists",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.42.5 */
    const file = "src/App.svelte";

    // (36:4) <Heading is="h2">
    function create_default_slot_7(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Find hidden playlists within your music using your listening history");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(36:4) <Heading is=\\\"h2\\\">",
    		ctx
    	});

    	return block;
    }

    // (41:5) {:else}
    function create_else_block(ctx) {
    	let spinner;
    	let current;

    	spinner = new Spinner({
    			props: { class: "margin" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(spinner.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(spinner, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spinner.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spinner.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(spinner, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(41:5) {:else}",
    		ctx
    	});

    	return block;
    }

    // (39:5) {#if !loading}
    function create_if_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Connect to Spotify");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(39:5) {#if !loading}",
    		ctx
    	});

    	return block;
    }

    // (38:4) <Button filled on:click={getAuthRedirect} class="padding" size="huge" palette="affirmative">
    function create_default_slot_6(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (!/*loading*/ ctx[0]) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index !== previous_block_index) {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(38:4) <Button filled on:click={getAuthRedirect} class=\\\"padding\\\" size=\\\"huge\\\" palette=\\\"affirmative\\\">",
    		ctx
    	});

    	return block;
    }

    // (30:2) <Stack class="center" padding="medium">
    function create_default_slot_5(ctx) {
    	let img;
    	let img_src_value;
    	let t0;
    	let spacer0;
    	let t1;
    	let heading;
    	let t2;
    	let spacer1;
    	let t3;
    	let button;
    	let current;

    	spacer0 = new Spacer({
    			props: { spacing: "large" },
    			$$inline: true
    		});

    	heading = new Heading({
    			props: {
    				is: "h2",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	spacer1 = new Spacer({
    			props: { spacing: "large" },
    			$$inline: true
    		});

    	button = new Button({
    			props: {
    				filled: true,
    				class: "padding",
    				size: "huge",
    				palette: "affirmative",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button.$on("click", /*getAuthRedirect*/ ctx[1]);

    	const block = {
    		c: function create() {
    			img = element("img");
    			t0 = space();
    			create_component(spacer0.$$.fragment);
    			t1 = space();
    			create_component(heading.$$.fragment);
    			t2 = space();
    			create_component(spacer1.$$.fragment);
    			t3 = space();
    			create_component(button.$$.fragment);
    			attr_dev(img, "id", "logo");
    			if (!src_url_equal(img.src, img_src_value = logo)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "Logo");
    			add_location(img, file, 33, 4, 1202);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(spacer0, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(heading, target, anchor);
    			insert_dev(target, t2, anchor);
    			mount_component(spacer1, target, anchor);
    			insert_dev(target, t3, anchor);
    			mount_component(button, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const heading_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				heading_changes.$$scope = { dirty, ctx };
    			}

    			heading.$set(heading_changes);
    			const button_changes = {};

    			if (dirty & /*$$scope, loading*/ 9) {
    				button_changes.$$scope = { dirty, ctx };
    			}

    			button.$set(button_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(spacer0.$$.fragment, local);
    			transition_in(heading.$$.fragment, local);
    			transition_in(spacer1.$$.fragment, local);
    			transition_in(button.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(spacer0.$$.fragment, local);
    			transition_out(heading.$$.fragment, local);
    			transition_out(spacer1.$$.fragment, local);
    			transition_out(button.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    			if (detaching) detach_dev(t0);
    			destroy_component(spacer0, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(heading, detaching);
    			if (detaching) detach_dev(t2);
    			destroy_component(spacer1, detaching);
    			if (detaching) detach_dev(t3);
    			destroy_component(button, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(30:2) <Stack class=\\\"center\\\" padding=\\\"medium\\\">",
    		ctx
    	});

    	return block;
    }

    // (29:1) <Route path="/">
    function create_default_slot_4(ctx) {
    	let stack;
    	let current;

    	stack = new Stack({
    			props: {
    				class: "center",
    				padding: "medium",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(stack.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(stack, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const stack_changes = {};

    			if (dirty & /*$$scope, loading*/ 9) {
    				stack_changes.$$scope = { dirty, ctx };
    			}

    			stack.$set(stack_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(stack.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(stack.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(stack, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(29:1) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (50:3) <Route path="/onboard">
    function create_default_slot_3(ctx) {
    	let mymusic;
    	let current;
    	mymusic = new MyMusic({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(mymusic.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(mymusic, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mymusic.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mymusic.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(mymusic, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(50:3) <Route path=\\\"/onboard\\\">",
    		ctx
    	});

    	return block;
    }

    // (53:3) <Route path="/playlists">
    function create_default_slot_2(ctx) {
    	let playlists;
    	let current;
    	playlists = new Playlists({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(playlists.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(playlists, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(playlists.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(playlists.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(playlists, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(53:3) <Route path=\\\"/playlists\\\">",
    		ctx
    	});

    	return block;
    }

    // (49:2) <Route path="/auth/*" slot="authed">
    function create_default_slot_1(ctx) {
    	let route0;
    	let t;
    	let route1;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/onboard",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "/playlists",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t = space();
    			create_component(route1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(route1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(route1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(49:2) <Route path=\\\"/auth/*\\\" slot=\\\"authed\\\">",
    		ctx
    	});

    	return block;
    }

    // (49:2) 
    function create_authed_slot(ctx) {
    	let route;
    	let current;

    	route = new Route({
    			props: {
    				path: "/auth/*",
    				slot: "authed",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				route_changes.$$scope = { dirty, ctx };
    			}

    			route.$set(route_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_authed_slot.name,
    		type: "slot",
    		source: "(49:2) ",
    		ctx
    	});

    	return block;
    }

    // (28:0) <Transition>
    function create_default_slot(ctx) {
    	let route0;
    	let t0;
    	let authguard;
    	let t1;
    	let route1;
    	let current;

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	authguard = new AuthGuard({
    			props: {
    				$$slots: { authed: [create_authed_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: { fallback: true, redirect: "/" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(route0.$$.fragment);
    			t0 = space();
    			create_component(authguard.$$.fragment);
    			t1 = space();
    			create_component(route1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(route0, target, anchor);
    			insert_dev(target, t0, anchor);
    			mount_component(authguard, target, anchor);
    			insert_dev(target, t1, anchor);
    			mount_component(route1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const route0_changes = {};

    			if (dirty & /*$$scope, loading*/ 9) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const authguard_changes = {};

    			if (dirty & /*$$scope*/ 8) {
    				authguard_changes.$$scope = { dirty, ctx };
    			}

    			authguard.$set(authguard_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(route0.$$.fragment, local);
    			transition_in(authguard.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(route0.$$.fragment, local);
    			transition_out(authguard.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(route0, detaching);
    			if (detaching) detach_dev(t0);
    			destroy_component(authguard, detaching);
    			if (detaching) detach_dev(t1);
    			destroy_component(route1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(28:0) <Transition>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let transition;
    	let t;
    	let sveltetoast;
    	let current;

    	transition = new Transition({
    			props: {
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	sveltetoast = new SvelteToast({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(transition.$$.fragment);
    			t = space();
    			create_component(sveltetoast.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(transition, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(sveltetoast, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const transition_changes = {};

    			if (dirty & /*$$scope, loading*/ 9) {
    				transition_changes.$$scope = { dirty, ctx };
    			}

    			transition.$set(transition_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(transition.$$.fragment, local);
    			transition_in(sveltetoast.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(transition.$$.fragment, local);
    			transition_out(sveltetoast.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(transition, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(sveltetoast, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const logo = "./Vibify-logos_white.png";

    function instance($$self, $$props, $$invalidate) {
    	let $store;
    	validate_store(store, 'store');
    	component_subscribe($$self, store, $$value => $$invalidate(2, $store = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let loading;

    	const getAuthRedirect = () => {
    		setTimeout(
    			() => {
    				$$invalidate(0, loading = true);
    			},
    			100
    		);

    		fetch($store.BASE_URL + "get-auth").then(data => data.json()).then(url => {
    			// loading= true;
    			// router.goto(url.url)
    			window.location.href = url.url;
    		});
    	};

    	mixpanel_cjs.init('a925c935d82ff2db81f3416c99ba0a36', { debug: false, ignore_dnt: true });
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		Route,
    		SvelteToast,
    		mixpanel: mixpanel_cjs,
    		MyMusic,
    		Transition,
    		AuthGuard,
    		Playlists,
    		store,
    		Button,
    		Spacer,
    		Spinner,
    		Stack,
    		Heading,
    		loading,
    		getAuthRedirect,
    		logo,
    		$store
    	});

    	$$self.$inject_state = $$props => {
    		if ('loading' in $$props) $$invalidate(0, loading = $$props.loading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [loading, getAuthRedirect];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {
            name: 'world'
        }
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
