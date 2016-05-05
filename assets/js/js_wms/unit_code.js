/**
 * 
 * 根据类型,单位返回数据
 */
function getValueByUnitCode(product_type, unit_code, value) {
	if(product_type == 'goods' && unit_code == 'kg') {
		return value * 2;
	}
	return value;
}