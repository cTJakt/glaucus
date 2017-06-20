import Get from './Get';
/**
 * Created by lucas on 2016/11/30.
 */
export default function (url, data) {
    return Get(url, {
        method: "POST",
        body: data
    });
}