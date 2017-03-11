
var reader = new FileReader();

var img_size;        				//об'являються тут, 
var img_pixels_user; 				//але заповнюються в хендлері, 
var img_pixels = []; 					//бо нужні доступними в глобальному об'єкті

var mouse_status;

var status_result_game = false;

var size_cell = {width: 10,  //редагувати синхронно з css
				 height: 10}
				 
add_hundlers4choice();

//Обробник закінчення загрузки
reader.onload = function(event) {
	var file_values = event.target.result.split(",");
	var width = +file_values[0];
	var height = +file_values[1];
	
	var tab = document.querySelector("tbody");
	if(tab) {
		tab.parentNode.removeChild(tab);
	}
			
	for(var i = 0; i < width; i++){
		img_pixels[i] = [];
		for(var j = 0; j < height; j++){
			img_pixels[i][j] = +file_values[i*height + j + 2];
		}
	}
	
	start_game(img_pixels);
	
};
 
reader.onerror = function(event) {
	console.error("Файл не может быть прочитан! код " + event.target.error.code);
};

//Обробник вибору файла для загрузки
var control = document.getElementById("saved_image");
control.addEventListener("change", function(event) {
	// Когда происходит изменение элементов управления, значит появились новые файлы
	var i = 0,
		files = control.files,
		len = files.length;
 
	for (; i < len; i++) {
		console.log("Filename: " + files[i].name);
		console.log("Type: " + files[i].type);
		console.log("Size: " + files[i].size + " bytes");
	}
	reader.readAsText(files[0]);
	
}, false);

function add_hundlers4choice() {
	
	var choice_table = document.querySelector(".choice-table");
	choice_table.childNodes[1].childNodes[1].onclick = choice_game;
	choice_table.childNodes[1].childNodes[3].onclick = choice_game;
	choice_table.childNodes[1].childNodes[5].onclick = choice_game;
	choice_table.childNodes[1].childNodes[7].onclick = choice_game;
	
}

//*********//
function start_game(img_pixels){
	
	var field = calculate_field(img_pixels); 
	
	img_size = {width: img_pixels[0].length,
		height: img_pixels.length,
		top_depth: field.top[0].length,
		right_depth: field.right[0].length};

	img_pixels_user = create_and_init_image_color( 3, img_pixels[0].length, img_pixels.length);
	table = create_table(table, img_size, img_pixels_user, field);
	apply_img_pixels(table, img_pixels_user, img_size);
	
	
	var elem_for_del = document.querySelector(".sector");
	if(elem_for_del) {
		elem_for_del.parentNode.removeChild(elem_for_del);
	}
	
	var elem_for_del = document.querySelector(".user_info_load");
	if(elem_for_del) {
		elem_for_del.parentNode.removeChild(elem_for_del);
	}
	
	elem_for_del = document.querySelector(".sector_img");
	if(elem_for_del) {
		elem_for_del.parentNode.removeChild(elem_for_del);
	}
}

//*********//
function hendler4_onmousedown(event){

	//Визначаємо координати комірки
	var className = this.classList[1];
	var position = {x: 0, y: 0};
	var shifted_table_data, shifted_field;
	position.y = +className.substring(0, className.indexOf('c'));
	position.x = +className.substring(className.indexOf('c') + 1);
	
	
	if(event.which === 1){ //Якщо нажата ліва кнопка
		//Змінюємо колір комірки
		if(this.style.backgroundColor ==='rgb(0, 0, 0)') {                                                               
			img_pixels_user[position.y - img_size.top_depth][position.x - img_size.right_depth] = mouse_status = 1; //Зробимо з чорного біле
		} else {
			img_pixels_user[position.y - img_size.top_depth][position.x - img_size.right_depth] = mouse_status = 0; //Зробимо з сірого або білого чорне
		}

		apply_img_pixel(table, img_pixels_user, img_size, position);
		
	} else if (event.which === 3){ //Якщо нажата права кнопка
		//Змінюємо колір комірки  
		if(this.style.backgroundColor === 'rgb(128, 128, 128)') {                                                               
			img_pixels_user[position.y - img_size.top_depth][position.x - img_size.right_depth] = mouse_status = 1; //Зробимо з сірого біле
		} else {
			img_pixels_user[position.y - img_size.top_depth][position.x - img_size.right_depth] = mouse_status = 3; //Зробимо з чорного або білого сіре
		}
		
		apply_img_pixel(table, img_pixels_user, img_size, position);
	}
	

}

//*********//
function hendler4_onmouseup(event){

	//Якщо отжата ліва кнопка
	if((event.which !== 1) && (event.which !== 3)){
		return;
	}
	
	if(check_result_game(img_pixels_user, img_pixels) && !status_result_game){
		alert("Вітаємо! Ви розгадали кросворд.");
		status_result_game = true;
	}

}

//*********//
function hendler4_onmouseover(event){
	
	if(!event.which) {
		mouse_status = -1;
	}
	
	console.log("dskjgfdsz");


	//Визначаємо координати комірки
	var className = this.classList[1];
	var position = {x: 0, y: 0};
	var shifted_table_data, shifted_field;
	position.y = +className.substring(0, className.indexOf('c'));
	position.x = +className.substring(className.indexOf('c') + 1);
	
	//Виділяємо комірки
	var field_cells = document.querySelectorAll(".top_" + (position.x - img_size.right_depth));
	for(var i = 0; i < field_cells.length; i++) {
		field_cells[i].style.backgroundColor = "#eeeeee";
	}
	
	var field_cells = document.querySelectorAll(".right_" + (position.y - img_size.top_depth));
	for(var i = 0; i < field_cells.length; i++) {
		field_cells[i].style.backgroundColor = "#eeeeee";
	}
	
	//Змінюємо колір комірки, якщо миша з'явилася вже з нажатою кнопкою
	if(event.which) {
			img_pixels_user[position.y - img_size.top_depth][position.x - img_size.right_depth] = mouse_status;
	}	
	
	//Виділення курсора
	table.rows[position.y].cells[position.x].style.backgroundImage = "url(round.png)";
	table.rows[position.y].cells[position.x].style.backgroundPosition = "center center";
	
	apply_img_pixel(table, img_pixels_user, img_size, position);
	

}

//*********//
function hendler4_onmouseout() {
	
	//Визначаємо координати комірки
	var className = this.classList[1];
	var position = {x: 0, y: 0};
	var shifted_table_data, shifted_field;
	position.y = +className.substring(0, className.indexOf('c'));// - img_size.top_depth;
	position.x = +className.substring(className.indexOf('c') + 1);// - img_size.right_depth;
	
	//Рисуємо всі комірки в колір по замовчуванню
	var defolt_field_color = "cyan" //pедагувати синхронно з css

	var field_cells = document.querySelectorAll(".top_" + (position.x - img_size.right_depth));
	for(var i = 0; i < field_cells.length; i++) {
		field_cells[i].style.backgroundColor = defolt_field_color;
	}
	
	var field_cells = document.querySelectorAll(".right_" + (position.y - img_size.top_depth));
	for(var i = 0; i < field_cells.length; i++) {
		field_cells[i].style.backgroundColor = defolt_field_color;
	}
	
	//Убираємо виділення курсора
	table.rows[position.y].cells[position.x].style.backgroundImage = "none";
	//table.rows[position.y].cells[position.x].style.backgroundPosition = "center center";
}

//*********//
//Два разних еплаї
function apply_img_pixel(table, img_pixels, img_size, position_cells) {
	var color_cells;
	switch(img_pixels[position_cells.y - img_size.top_depth][position_cells.x - img_size.right_depth]) {
		case(1): {
			color_cells = '#ffffff';
			break;
		}
		case(0): {
			color_cells = '#000000';
			break;
		}
		case(3): {
			color_cells = '#808080';
			break;
		}
	}

	table.rows[position_cells.y].cells[position_cells.x ].style.backgroundColor = color_cells;
}

//*********//
function apply_img_pixels(table, img_pixels, img_size) {
	var color_cells;	
	for(var i = 0; i < img_size.width; i++) {
		for(var j = 0; j < img_size.height; j++){
			switch(img_pixels[j][i]) {
				case(1): {
					color_cells = '#ffffff';
					break;
				}
				case(0): {
					color_cells = '#000000';
					break;
				}
				case(3): {
					color_cells = '#808080';
					break;
				}
			}
			table.rows[j + img_size.top_depth].cells[i + img_size.right_depth].style.backgroundColor = color_cells;
		}

	}
}

//*********//
function calculate_and_apply_field(img_pixels, img_size, position_cells, field) {
	var right_field_line = [];
	var top_field_line = [];
	
	//Розрахунок правого поля
	var key4field_data = 0;
	right_field_line[key4field_data] = 0;
	for(var i = 0; i < (img_size.width + 1); i++) {
		if(img_pixels[position_cells.y - img_size.top_depth][img_size.width - i - 1] === 0){
			right_field_line[key4field_data] += 1;
		}
		else {
			if(right_field_line[key4field_data] > 0) {
				key4field_data++;
				right_field_line[key4field_data] = 0;
			}

		}
	}
	
	//Розрахунок верхнього поля
	var key4field_data = 0;
	top_field_line[key4field_data] = 0;
	
	for(var i = 0; i < img_size.height; i++) {
		if(img_pixels[img_size.height - i - 1][position_cells.x - img_size.right_depth] === 0){
			top_field_line[key4field_data] += 1;
		}
		else {
			if(top_field_line[key4field_data] > 0) {
				key4field_data++;
				top_field_line[key4field_data] = 0;
			}

		}
	}	
	if(top_field_line[top_field_line.length - 1]){
		top_field_line = top_field_line.concat(0);
	}	
	
	//Впишемо right_field_line в field
	for(var i = 0; i < img_size.right_depth; i++){
		if(right_field_line[i]) {
			//table.rows[position_cells.y].cells[img_size.right_depth - i - 1].innerHTML = right_field_line[i];
			field.right[img_size.right_depth - i - 1][position_cells.y - img_size.top_depth] = right_field_line[i];
		}
		else{
			//table.rows[position_cells.y].cells[img_size.right_depth - i - 1].innerHTML = "";
			field.right[img_size.right_depth - i - 1][position_cells.y - img_size.top_depth] = "";
		}
	}

	//Впишемо top_field_line в field
	for(var i = 0; i < img_size.top_depth; i++){
		if(top_field_line[i]) {
			//table.rows[img_size.top_depth - i - 1].cells[position_cells.x].innerHTML = top_field_line[i];
			field.top[img_size.top_depth - i - 1][position_cells.x - img_size.right_depth] = top_field_line[i];
		}
		else{
			//table.rows[img_size.top_depth - i - 1].cells[position_cells.x].innerHTML = "";
			field.top[img_size.top_depth - i - 1][position_cells.x - img_size.right_depth] = "";
		}
	}

	//Динамічна зміна поля
	//Збільшення поля
	if((field.top.length + 1) === top_field_line.length){
		empty_line_field = [[]];
		for(var i = 0; i < field.top[0].length; i++){
			empty_line_field[0][i] = "";
		}
		field.top = empty_line_field.concat(field.top);
		img_size.top_depth++;
		position_cells.y++;
	}

	if((field.right.length + 1) === right_field_line.length){
		empty_line_field = [[]];
		for(var i = 0; i < field.right[0].length; i++){
			empty_line_field[0][i] = "";
		}
		field.right = empty_line_field.concat(field.right);
		img_size.right_depth++;
		position_cells.x++;
	}

	//Зменшення поля правого
	sub_field = true;
	for(var i = 0; i < img_size.height; i++) {
		if(field.right[1][i] !== ""){
			sub_field = false;
			break;
		}
	}
	if(sub_field){
		field.right = field.right.splice(1, field.right.length);
		img_size.right_depth--;
	}

	//Зменшення поля верхнього
	sub_field = true;
	for(var i = 0; i < img_size.width; i++) {
		if(field.top[1][i] !== ""){
			sub_field = false;
			break;
		}
	}
	if(sub_field){
		field.top = field.top.splice(1, field.top.length);
		img_size.top_depth--;
	}

	return({field, img_size, position_cells});
} 

//*********//
function create_and_init_image_color(color, width, height) {
	
	//Створимо масив img_pixels
	var img_pixels = [];
	for(var i = 0; i < height; i++) {
		img_pixels[i] = [];
	}

	for(var i = 0; i < width; i++) {
		for(var j = 0; j < height; j++){
			img_pixels[j][i] = color;
		}
	}
	return(img_pixels);
}

//*********//
function check_result_game(img_pixels_user, img_pixels) {
	
	var field 	   = calculate_field(img_pixels);
	var field_user = calculate_field(img_pixels_user);
	
	var top_depth 		 =  field.top[0].length;
	var right_depth 	 =  field.right[0].length;				
	var top_depth_user   =  field_user.top[0].length;
	var right_depth_user =  field_user.right[0].length;
	
	var top_width 		 =  field.top.length;
	var right_width 	 =  field.right.length;
	
	if((top_depth !== top_depth_user) || (right_depth !== right_depth_user)) {
		return false;
	}
	
	for(var i = 0; i < top_width; i++){
		for(var j = 0; j < top_depth; j++){
			if(field.top[i][j] === field_user.top[i][j]){
				continue;
			} else {
				return false;
			}
		}
	}
	
	for(var i = 0; i < right_width; i++){
		for(var j = 0; j < right_depth; j++){
			if(field.right[i][j] === field_user.right[i][j]){
				continue;
			} else {
				return false;
			}
		}
	}
	
	return true;
}

//*********//
function choice_game() {
	var className = this.classList[0];
	
	var imag_txt_arr = [imag_txt_1, imag_txt_2, imag_txt_3, imag_txt_4];
	
	
	
	
	
	var x = className.substring(className.indexOf('-') + 2);

	//eval("var file_upload = imag_txt_" + x + "; ");
	
	var file_upload = imag_txt_arr[x];
	
	var width = +file_upload[0]; 
	var height = +file_upload[1];
	
	for(var i = 0; i < width; i++){
		img_pixels[i] = [];
		for(var j = 0; j < height; j++){
			img_pixels[i][j] = +file_upload[i*height + j + 2];
		}
	}
	
	console.log(file_upload);
	
	start_game(img_pixels);
	
}
