// 日期处理
// 日期间隔
import { useState } from 'react'
// import type { Ref, ComputedRef } from 'vue'

export const useDateInterval = () => {
    const [day, setDay] = useState('')

    function DateInterval(
        startTime: number | string | Date,
        endTime: number | string | Date
    ) {
        let start = new Date(startTime)
        let end = new Date(endTime)
        useState(Math.ceil(Math.abs(start.getTime() - end.getTime()) / 86400000))
        return day
    }
    return { day, DateInterval, setDay }
}
// 格式化时间
/**
 * 使用：
 * TimeFormat() // 默认返回当前时间 yyyy-mm-dd
 * TimeFormat('yyyy-mm-dd hh:ii') // 默认返回当前时间 自定义格式
 * TimeFormat('yyyy/mm/dd hh:ii:ss', 1554954127000) // 返回传入时间戳的格式化时间
 */
export const useTimeFormat = () => {
    const [newTime, setNewTime] = useState('')

    function timeFormat(type: string = 'yyyy-mm-dd', d?: string | Date | number): string {
        const date = d ? new Date(d) : new Date();

        const o: { [key: string]: number } = {
            'm+': date.getMonth() + 1, // 月份
            'd+': date.getDate(), // 日
            'h+': date.getHours(), // 小时
            'i+': date.getMinutes(), // 分
            's+': date.getSeconds(), // 秒
        };

        let formattedTime = type.replace(/(y+)/, ($0: string) => {
            return (date.getFullYear() + '').slice(-$0.length);
        });

        for (const key in o) {
            if (new RegExp('(' + key + ')').test(type)) {
                const value = o[key];
                formattedTime = formattedTime.replace(new RegExp(key, 'g'), ($0: string) => {
                    return ($0.length === 1) ? value.toString() : ('00' + value).slice(-$0.length);
                });
            }
        }
        setNewTime(formattedTime)

        return newTime
    }

    return {
        newTime,
        timeFormat,
        setNewTime
    };
};