
//*********//
function calculate_field(img_pixels) {
	var right_field_line = [];
	var top_field_line = [];
	var height = img_pixels.length;
	var width = img_pixels[0].length;
	var field = {right: [],
				 top:   []};
	var max_depth = 0;
	var line_depth;

	//Якщо img_pixels пустий, просто ініціалізуємо field
	var status_empty_img = true;
	for(var i = 0; i < img_pixels.length; i++){
		for(var j = 0; j < img_pixels[0].length; j++){
			if(!img_pixels[i][j]) {
				status_empty_img = false;
				break;
			}
		}
		if(!status_empty_img) {
			break;
		}
	}
	if(status_empty_img){
		for(var i = 0; i < img_pixels.length; i++){
			field.top[i] =[""];
			field.right[i] = [""];
		}
		return(field);
	}
	
				 
	//Розрахунок правого поля
	var key4field_data = 0;
	
	for(var j = 0; j < height; j++){
		right_field_line = [];
		key4field_data = 0;
		right_field_line[key4field_data] = 0;
		for(var i = 0; i < width; i++) {
			if(img_pixels[j][width - i - 1] === 0){
				right_field_line[key4field_data] += 1;
			}
			else {
				if(right_field_line[key4field_data] > 0) {
					key4field_data++;
					right_field_line[key4field_data] = 0;
				}

			}
		}
		if(right_field_line[right_field_line.length - 1] === 0){
			right_field_line = right_field_line.splice(0, (right_field_line.length - 1));
		}
		field.right[j] = right_field_line;
		
		if(max_depth < right_field_line.length){
			max_depth = right_field_line.length;
		}
	}
	
	//підганяємо розміри рядків правого поля
	for(var i = 0; i < height; i++){
		line_depth = field.right[i].length;
		for(var j = 0; j < (max_depth - line_depth); j++){
			field.right[i].push("");
		}
	}

	//Розрахунок верхнього поля
	var key4field_data = 0;
	max_depth = 0;
	for(var j = 0; j < width; j++){
		top_field_line = [];
		key4field_data = 0;
		top_field_line[key4field_data] = 0;
		for(var i = 0; i < height; i++) {
			if(img_pixels[height - i - 1][j] === 0){
				top_field_line[key4field_data] += 1;
			}
			else {
				if(top_field_line[key4field_data] > 0) {
					key4field_data++;
					top_field_line[key4field_data] = 0;
				}

			}
		}
		if(top_field_line[top_field_line.length - 1] === 0){
			top_field_line = top_field_line.splice(0, (top_field_line.length - 1));
		}
		field.top[j] = top_field_line;
		
		if(max_depth < top_field_line.length){
			max_depth = top_field_line.length;
		}
	}
	
	//підганяємо розміри рядків верхнього поля
	for(var i = 0; i < width; i++){
		line_depth = field.top[i].length;
		for(var j = 0; j < (max_depth - line_depth); j++){
			field.top[i].push("");
		}
	}

	return(field);
} 

//*********//
function create_table(table, img_size, img_pixels, field) {
	
	var new_elem_table = document.createElement('tbody');
	new_elem_table.innerHTML = create_tbody(img_size.height + img_size.top_depth, img_size.width + img_size.right_depth, img_size);
	table.appendChild(new_elem_table);
	//var field = calculate_field(img_pixels);
	//console.log(field);
	apply_field(table, field);
	
	//field = calculate_field(img_pixels);
	
	//Робимо товсті лінії
	//table = make_thick_border(table, img_size);
	
	//Вішаємо хендлер на onclic на комірки image
	for(var i = img_size.right_depth; i < (img_size.right_depth + img_size.width); i++){
		for(var j = img_size.top_depth; j < (img_size.top_depth + img_size.height); j++){
			table.rows[j].cells[i].onmousedown 		= hendler4_onmousedown;
			table.rows[j].cells[i].onmouseover 		= hendler4_onmouseover;
			table.rows[j].cells[i].onmouseout 		= hendler4_onmouseout;
			//table.rows[j].cells[i].onmouseup 		= hendler4_onmouseup;
			
		}
	}
	
	table.oncontextmenu=function(){return false}; //Виключаємо контекстне меню в таблиці
	
	document.onmouseup 		= hendler4_onmouseup;
	
	return(table);
}

//*********//
function apply_field(table, field) {
	var color_cells;	
	var right_depth = field.right[0].length;
	var top_depth = field.top[0].length;

	for(var i = 0; i < field.top.length; i++) {
		for(var j = 0; j < field.top[0].length; j++){
			table.rows[top_depth - j - 1].cells[right_depth + i].innerHTML = field.top[i][j];
			table.rows[top_depth - j - 1].cells[right_depth + i].classList.add("top_" + i);
		}
	}
	for(var i = 0; i < field.right.length; i++) {
		for(var j = 0; j < field.right[0].length; j++){
			table.rows[i + top_depth].cells[right_depth - j - 1].innerHTML = field.right[i][j];
			table.rows[i + top_depth].cells[right_depth - j - 1].classList.add("right_" + i);
		}
	}
}

//*********//
function create_tbody(width, height, img_size) {
	table_string = "";
	for(var i = 0; i < width; i++){
		table_string += "<tr>";
		for(j = 0; j < height; j++){
			switch(true) {
				case((i < img_size.top_depth) && (j < img_size.right_depth)): {
					table_string += "<td class='space'></td>";
					break;
				}
				case((i < img_size.top_depth) || (j < img_size.right_depth)): {
					table_string += "<td class='field '></td>";
					break;
				} 
				default: {
					table_string += "<td class='image " + i + "c" + j + "' </td>";//style='background-color: #808080'></td>";
				}
			}
		}
		table_string += "</tr>";
	}
	return(table_string);
}

//*********//
function make_thick_border(table, img_size) {
	var rows = table.childNodes[0].childNodes;
	var number_cells = rows[0].childNodes.length;
	var number_rows = rows.length;
	
	//Горизонтальні лінії
	for(var i = (img_size.top_depth - 1); i < (number_rows - 1); i += 5) { // -1 щоб не рисувать товстий бордер в останнього рядка
		for(var j = 0; j < (number_cells); j += 1) {
			table.rows[i].cells[j].style.borderBottom = '2px solid #00eeff'; //редагувати синхронно з css
		}
	}
	
	//Вертикальні лінії
	for(var i = (img_size.right_depth - 1); i < (number_cells - 1); i += 5) { // -1 щоб не рисувать товстий бордер в останнього стовпчика
		for(var j = 0; j < (number_rows); j += 1) {
			table.rows[j].cells[i].style.borderRight = '2px solid #00eeff'; //редагувати синхронно з css
		}
	}
	
	return table;		
}