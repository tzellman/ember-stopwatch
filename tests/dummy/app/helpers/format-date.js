import { helper } from '@ember/component/helper';
import * as moment from 'moment';

export default helper(function formatDate([dateMillis, format]) {
    return moment(dateMillis ?? new Date()).format(format);
});
