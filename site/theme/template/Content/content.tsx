import React, { createRef, useEffect, useState } from 'react';
import { browserHistory, Link } from 'bisheng/router';
import Demo from './Demo';
import CodeView from './Demo/CodePreView'
import './index.less';
interface Meta {
    category: string | "Components"
    filename: string
    subTitle: string
    title: string
    type: string
    id?: string
}
const Content = (props: any) => {
    const [code, setCode] = useState<Object | any>(null);
    const codeEl = createRef<HTMLDivElement>() 
    const to = ($$i: Meta) => {
        let toL = $$i.filename.split('/');
        let topath = toL[0] + '/' + toL[1] + '/';
        return <Link to={topath}> {$$i.title} {$$i.subTitle}</Link>
    }

    const getMenuItems = () => {
        let cdata = props.data.components;
        let components = new Array()
        for (let k in cdata) {
            let _i = cdata[k]?.index
            let title = _i?.meta?.title || false;
            console.log(title)
            if (_i?.meta?.category === 'Components') {
                let typed = components.find($$i => $$i.type == _i?.meta?.type);
                if (typed) {
                    typed.children.push(_i?.meta)
                } else {
                    let type = {
                        type: _i?.meta?.type,
                        children: [_i?.meta]
                    }
                    components.push(type)
                }
            }
        }
        return <ul>
            {
                components.map(item => {
                    return <li key={item.type}>
                        <p>{item.type}</p>
                        <ol>
                            {item.children.map((i2: Meta) => {
                                return <li
                                    key={i2.title}
                                    className={i2.filename.indexOf(location.pathname.slice(1)) > -1 ? 'active' : ''}
                                >{to(i2)}</li>
                            })}
                        </ol>
                    </li>
                })
            }
        </ul>
    };

    const childrenSetCode = (_code: Object) =>  {
        // (codeEl.current as any).classList.add('active');
        
        setCode(code ? null : _code)}

    const demo = () => {
        const demos = props.demo;
        const l = new Array();
        for (let [_, v] of Object.entries(demos)) {
            l.push(v)
        }
        let $l = l.sort((a, b) => (a.meta.order || 0) - (b.meta.order || 0));
        return $l.map((content, i) => {
            return <Demo key={i} {...{...content, childrenSetCode}} />
        })
    }
    useEffect(() => {
        setCode(null)
        // (document.querySelector('.Header') as any).classList.add('cmps')
    }, [location.pathname])
    return <div className='main'>
        <div className="menu">
            {getMenuItems()}
        </div>
        <div className="show-components">
            <h2>代码演示</h2>
            {demo()}
        </div>
        <div className={code !== null ? 'code active' : 'code'} ref={codeEl} >
            <CodeView toReactComponent={props.utils.toReactComponent} code={code} />
        </div>
    </div>
}

export default Content

export { Meta }