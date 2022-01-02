import { sliderTypes, sliderProps } from './type';
import { runIFELSE, sto, has } from '../_utils/common';
import { defineEl, setStyle, getProps, listener } from '../_utils/dom';
import Base from '../_utils/Base';
import { createEl } from 'sparrow-ui/_utils/dom';
import CreateSlider from './time/createSlider'
import { clacMethds } from './time/calc'
import { getPrecision } from './time/_utils'
class Silder extends Base {
    context: this
    constructor() {
        super();
        const context = this;
        defineEl({
            tag: 'sp-slider',
            observedAttributes: Object.keys(sliderProps),
            connectedCallback() {
                (this.attrs as Partial<sliderTypes>) = getProps(this);
                this.attrs = { ...sliderProps, ...this.attrs };
                this.attrs.vertical = this.attrs.vertical + '' == 'true' ? true : false

                context.initView(this, this.attrs).then(({ railEl, trackEl, handleEl, tooltip, defaults, handleEl2 }) => {
                    this.append(railEl, trackEl, handleEl, handleEl2);

                    this.core = new CreateSlider({
                        ctxTarget: this,
                        handlesRefs: [handleEl, handleEl2 || false],
                        trackEl,
                        defaults,
                        ...this.attrs
                    })

                    this.core.PROPSCHANGE = ({ o_percent, t_percent, oValue, tValue, trackEvent, trackValue, curHandle }: any) => {
                        if (curHandle == 2) {
                            let offset_xy:any = [this.attrs.vertical ? 'offsetY' : 'offsetX'];
                            let offset_wh:any = [this.attrs.vertical ? 'offsetHeight' : 'offsetWidth'];
                            let offset_lt:any = [this.attrs.vertical ? 'offsetTop' : 'offsetLeft'];
                            let style_lp:any = [this.attrs.vertical ? 'top' : 'left'];
                            let style_rt:any = [this.attrs.vertical ? 'bottom' : 'right'];
                            let reverse = this.attrs.vertical ? this.attrs.vertical : !this.attrs.vertical;
                            let target_wh = this[offset_wh];

                            let min = target_wh * (t_percent / 100) - trackEvent[offset_xy];
                            let max = target_wh * (t_percent / 100) + trackEvent.target[offset_wh] - trackEvent[offset_xy];
                            setStyle(trackEl, {
                                [style_lp]: reverse ? 'auto' : min < 0 ? '0' : max >= target_wh ? target_wh - trackEvent.target[offset_wh] + 'px' : `calc(${t_percent + '%'} - ${trackEvent[offset_xy]}px)`,
                                [style_rt]: !reverse ? 'auto' : min < 0 ? '0' : max >= target_wh ? target_wh - trackEvent.target[offset_wh] + 'px' : `calc(${t_percent + '%'} - ${trackEvent[offset_xy]}px)`,
                            })
                            setStyle(handleEl, {
                                [style_lp]: reverse ? 'auto' : min < 0 ? '0' : max >= target_wh ? target_wh - trackEvent.target[offset_wh] + 'px' : `calc(${t_percent}% - ${trackEvent[offset_xy] + 4}px)`,
                                [style_rt]: !reverse ? 'auto' : min < 0 ? '0' : max >= target_wh ? target_wh - trackEvent.target[offset_wh] + 'px' : `calc(${t_percent}% - ${trackEvent[offset_xy] + 4}px)`,
                            })
                            setStyle(handleEl2, {
                                [style_lp]: reverse ? 'auto' : min < 0 ? trackEvent.target[offset_wh] + 'px' : max >= target_wh ? target_wh - 5 + 'px' : `calc(${t_percent}% + ${trackEvent.target[offset_wh] - trackEvent[offset_xy] - 5}px)`,
                                [style_rt]: !reverse ? 'auto' : min < 0 ? trackEvent.target[offset_wh] + 'px' : max >= target_wh ? target_wh - 5 + 'px' : `calc(${t_percent}% + ${trackEvent.target[offset_wh] - trackEvent[offset_xy] - 5}px)`,
                            })
                            let h1v = clacMethds.calcValue(handleEl[offset_lt] + 3, {
                                ctxTarget: this,
                                ...this.attrs
                            });
                            let h2v = clacMethds.calcValue(handleEl2[offset_lt] + 3, {
                                ctxTarget: this,
                                ...this.attrs
                            });
                            handleEl['attr-title'] = parseFloat(h1v.toFixed(getPrecision(this.attrs.step)));
                            handleEl2['attr-title'] = parseFloat(h2v.toFixed(getPrecision(this.attrs.step)));
                            if (this.attrs.tooltipvisible && this.attrs.tooltipvisible + '' == 'true') {
                                handleEl?.super?._changePosition(handleEl.super.fixedEl, this.attrs.vertical ? 'right' :'top', false)
                                handleEl2?.super?._changePosition(handleEl2.super.fixedEl, this.attrs.vertical ? 'right' :'top', false)
                            }
                            return;
                        }
                        // console.log(o_percent)
                        context.changeStyle({
                            trackEl,
                            handleRefs: {
                                o: handleEl,
                                o_percent: o_percent ?? undefined,
                                t: handleEl2,
                                t_percent: t_percent ?? undefined,
                                defaults
                            },
                            reverse: this.attrs.reverse,
                            vertical: this.attrs.vertical + '' == 'true' ? true : false
                        });
                        if (this.attrs.tooltipvisible + '' !== 'false') {
                            if (oValue) {
                                handleEl['attr-title'] = oValue;
                                handleEl?.super?._changePosition(handleEl.super.fixedEl, this.attrs.vertical ? 'right' : 'top', false)
                            }
                            if (tValue) {
                                handleEl2['attr-title'] = tValue;
                                handleEl2?.super?._changePosition(handleEl2.super.fixedEl, this.attrs.vertical ? 'right' : 'top', false)
                            }
                        }

                    }
                    this.core.PROPSHANDLEMOUSEUP = (_: any, handleFlag: number = 0) => {
                        context.tooltipShow(this.attrs.tooltipvisible, handleFlag ? handleEl2 : handleEl, 'false', false);

                    }
                    this.core.PROPSHANDLEMOUSEDOWN = (_: any, handleFlag: number = 0) => {
                        context.tooltipShow(this.attrs.tooltipvisible, handleFlag ? handleEl2 : handleEl, 'true', false);

                    }
                    this.core.onMounted();
                    // 需要处理
                    if (!this.attrs.draggabletrack && defaults.length < 2) {
                        listener(railEl, 'mousedown', e => this.core.onMouseStart(e))
                        listener(trackEl, 'mousedown', e => this.core.onMouseStart(e))
                    }
                })

            }
        })
    }

    setTrackStyle({
        o_percent,
        t_percent,
        handleEl2,
        handleEl,
        trackEl,
        offset
    }: any) {
        let unit = o_percent !== undefined && t_percent !== undefined ? '%' : 'px';
        let _offset: any = handleEl2[offset] > handleEl[offset] ? handleEl[offset] + 'px' : handleEl[offset] > handleEl2[offset] ? handleEl2[offset] + 'px' : 0;
        let distance = unit == 'px' ? Math.abs(handleEl2[offset] - handleEl[offset]) + 'px' : Math.abs(t_percent - o_percent) + '%'
        setStyle(trackEl, {
            height:offset.indexOf('Top') > -1 ? distance : undefined,
            width:offset.indexOf('Left') > -1 ? distance : undefined,
            top: offset.indexOf('Top') > -1 ? _offset : 'auto',
            left: offset.indexOf('Left') > -1 ? _offset : 'auto',
        })
    }

    changeStyle({ trackEl, handleRefs, reverse, vertical, init = false }: any) {
        reverse = reverse + '' == 'true'
        let { o_percent, t_percent, t: handleEl2, o: handleEl, defaults } = handleRefs
        if (vertical) {
            if (defaults.length >= 2) {
                o_percent !== undefined && setStyle(handleEl, {
                    bottom: reverse ? 'auto' : `calc(${o_percent}% - 4px)`,
                    top: !reverse ? 'auto' : `calc(${o_percent}% - 10px)`,
                })
                t_percent !== undefined && setStyle(handleEl2, {
                    bottom: reverse ? 'auto' : `calc(${t_percent}% - 4px)`,
                    top: !reverse ? 'auto' : `calc(${t_percent}% - 10px)`,
                })
                let params = {
                    o_percent,
                    t_percent,
                    handleEl2,
                    handleEl,
                    trackEl,
                    offset: 'offsetTop'
                }
                init ? sto(() => this.setTrackStyle(params)) : this.setTrackStyle(params);
                return
            }
            setStyle(trackEl, {
                height: o_percent + '%',
                top: !reverse ? 'auto' : '0%',
                bottom: reverse ? 'auto' : '0%',
            })
            setStyle(handleEl, {
                top: !reverse ? 'auto' : `calc(${o_percent}% - 4px)`,
                bottom: reverse ? 'auto' : `calc(${o_percent}% - 10px)`,
            })
            return
        }
        if (defaults.length >= 2) {

            o_percent !== undefined && setStyle(handleEl, {
                left: reverse ? 'auto' : `calc(${o_percent}% - 4px)`,
                right: !reverse ? 'auto' : `calc(${o_percent}% - 10px)`,
            })

            t_percent !== undefined && setStyle(handleEl2, {
                left: reverse ? 'auto' : `calc(${t_percent}% - 4px)`,
                right: !reverse ? 'auto' : `calc(${t_percent}% - 10px)`,
            })

            // sto(() => {
            //     let unit = o_percent !== undefined && t_percent !== undefined ? '%' : 'px';
            //     let width = unit == 'px' ? Math.abs(handleEl2.offsetLeft - handleEl.offsetLeft) + 'px' : Math.abs(t_percent - o_percent) + '%'
            //     let left: any = handleEl2.offsetLeft > handleEl.offsetLeft ? handleEl.offsetLeft + 'px' : handleEl.offsetLeft > handleEl2.offsetLeft ? handleEl2.offsetLeft + 'px' : 0;
            //     // let percent = (!reverse ? o_percent - 1 : 100 - o_percent * 2) + '%'
            //     setStyle(trackEl, {
            //         width,
            //         left
            //     })
            // })
            let params = {
                o_percent,
                t_percent,
                handleEl2,
                handleEl,
                trackEl,
                offset: 'offsetLeft'
            }
            init ? sto(() => this.setTrackStyle(params)) : this.setTrackStyle(params);
            return
        }
        setStyle(trackEl, {
            width: o_percent + '%',
            left: reverse ? 'auto' : '0%',
            right: !reverse ? 'auto' : '0%',
        })
        setStyle(handleEl, {
            left: reverse ? 'auto' : `calc(${o_percent}% - 4px)`,
            right: !reverse ? 'auto' : `calc(${o_percent}% - 10px)`,
        })
    }

    tooltipShow(tooltipvisible: any, tooltip: any, show: 'true' | 'false' = 'true', isinit = true) {
        if (tooltipvisible == undefined) {
            if (isinit) {
                listener(tooltip, 'mouseenter', () => {
                    tooltip?.super?.visible('true') ||
                        (tooltip['attr-visible'] = 'true')
                })
                listener(tooltip, 'mouseleave', () => {
                    if (tooltip.show == 'true') return;
                    tooltip?.super?.visible('false') || (tooltip['attr-visible'] = 'false')
                })
                return;
            }
            tooltip.show = show
            tooltip?.super?.visible(show) || (tooltip['attr-visible'] = show)
            return
        }
        if (tooltipvisible && tooltipvisible + '' == 'true' && isinit) {
            tooltip?.super?.visible('true') ||
                (tooltip['attr-visible'] = 'true')
            return
        }
    }

    adapterDefaults(_default: string | any[] | number | any): any[] {
        return _default.pop ?
            _default :
            _default.indexOf(',') == -1 ?
                [_default]
                : _default.indexOf('[') > -1 ?
                    JSON.parse(_default)
                    : _default.split(',');
    }


    initView(target: any, attrs: sliderTypes) {
        let tagName = 'sp-slider';
        let railEl = createEl('div'),
            trackEl = createEl('div'),
            tempHandleEl = createEl('div'),
            tempHandleEl2: any = '',
            tooltip = createEl('sp-tooltip'),
            defaults: any = this.adapterDefaults(attrs.default as any);
        tooltip['attr-title'] = defaults[0];
        tooltip['attr-trigger'] = 'no';
        tooltip.getPopupContainer = () => target
        tooltip.setAttribute('name', 'slider-handle');
        railEl.className = tagName + '-rail';
        trackEl.className = tagName + '-track';
        if (attrs.vertical) {
            tooltip['attr-placement'] = 'right';

        }
        if (defaults.length >= 2) {
            tempHandleEl2 = createEl('div');
        }
        if (attrs.tooltipvisible && attrs.tooltipvisible + '' == 'false') {
            tempHandleEl.className = tagName + '-handle';
            if (tempHandleEl2) {
                tempHandleEl2.className = tagName + '-handle-t';
                target.append(tempHandleEl2);
            }
        } else {
            let tmptool = tooltip;
            tmptool.append(tempHandleEl.cloneNode(true));
            tempHandleEl = tmptool;
            this.tooltipShow(attrs.tooltipvisible, tempHandleEl);

            // 第二个克隆
            if (defaults.length >= 2) {
                let tmpTool2 = tooltip.cloneNode(true);
                tmpTool2.getPopupContainer = () => target;
                tmpTool2['attr-title'] = defaults[1];
                tmpTool2.append(tempHandleEl2.cloneNode(true));
                tempHandleEl2 = tmpTool2;
                this.tooltipShow(attrs.tooltipvisible, tempHandleEl2);
            }
        }
        let o_percent = 100 / (attrs.max - attrs.min) * (defaults[0] - attrs.min);
        let t_percent = 100 / (attrs.max - attrs.min) * (defaults[1] - attrs.min);

        tempHandleEl.setAttribute('hidefocus', true);
        tempHandleEl.setAttribute('tabindex', 0);
        tempHandleEl2 && tempHandleEl2.setAttribute('hidefocus', true);
        tempHandleEl2 && tempHandleEl2.setAttribute('tabindex', 0);
        this.changeStyle({
            trackEl,
            handleRefs: {
                o_percent,
                o: tempHandleEl,
                t_percent: defaults[1] && t_percent,
                t: tempHandleEl2,
                defaults
            },
            reverse: attrs.reverse,
            vertical: attrs.vertical + '' == 'true' ? true : false,
            init: true
        })
        this._setClassName(target, (attrs.vertical ? '--vertical' : ''))

        return Promise.resolve({
            railEl, trackEl, handleEl: tempHandleEl, tooltip, defaults, handleEl2: tempHandleEl2
        })
    }
}


export default new Silder()