import { Fragment, Comment } from 'vue';
import type { VNode, RendererNode, RendererElement } from 'vue';

export type SpecificVNode<T> = VNode<RendererNode, RendererElement, T>;
export function flatten<T = Record<string, unknown>>(vNodes?: SpecificVNode<T>[], identificationKey?: Symbol | Symbol[], mode = false, result: SpecificVNode<T>[] = [], isInfinity = false) {
    if (!vNodes) return result;
    const auth = (key?: Symbol) => {
        return key ? (Array.isArray(identificationKey) ? (mode ? !identificationKey.includes(key) : identificationKey.includes(key)) : mode ? key !== identificationKey : key === identificationKey) : false;
    };
    const filterVNodes = identificationKey
        ? vNodes.filter(vNode => {
              const { iKey } = vNode.type as any;
              return auth(iKey) || vNode.type === Fragment || isInfinity;
          })
        : vNodes;

    for (const vNode of filterVNodes) {
        const children = ((isInfinity ? (vNode.children as Record<'default', () => any>)?.default?.() : vNode.children) ?? []) as SpecificVNode<T>[];
        const { iKey } = vNode.type as any;
        if (isInfinity && auth(iKey)) {
            result.push(vNode);
        } else if (vNode.type === Fragment || (isInfinity && children.length > 0)) {
            flatten(children, identificationKey, mode, result, isInfinity);
        } else if (vNode.type !== Comment) {
            result.push(vNode);
        }
    }

    return result;
}
