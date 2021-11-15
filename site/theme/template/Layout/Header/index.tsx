import React, { useEffect, useRef, useState } from 'react'
import { Link, browserHistory } from 'bisheng/router';
import './index.less';
const Header: React.FC = () => {
    const [isotherClass, setOther] = useState('');
    const l = [{
        to: '/',
        label: '设计'
    },
    {
        to: '/docs/react/index/',
        label: '文档'
    },
    {
        to: '/components/modal/',
        label: '组件'
    },
    {
        to: '/theme',
        label: '主题'
    }, {
        to: '/github',
        label: 'github'
    },
    ]

    useEffect(() => {
        setOther(location.pathname == '/' ? '' : 'other')
    }, [location.pathname])

    return <section className={'Header'}>
        <div className={isotherClass}>
            <div className="l-h">
                <Link to='/' className="logo">
                    <div className="img" > </div>
                    <span>Sprrow</span>
                </Link>
                <div>
                    Search
                </div>
            </div>
            <div className="r-h">
                <div className="l">
                    <ul>
                        {
                            l.map(i => {
                                return <li key={i.label} className={location.pathname == i.to || (location.pathname.indexOf('components') > -1 && i.to.indexOf('components') > -1) ? 'active' : ''}>
                                    <Link to={i.to} > {i.label}</Link>
                                </li>
                            })
                        }
                    </ul>
                </div>
            </div>
        </div>

    </section>
}

export default Header


