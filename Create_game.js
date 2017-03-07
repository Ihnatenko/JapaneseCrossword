var img_size = {width: 10,
				height: 10,
				top_depth: 1,
				right_depth: 1};
				
var size_cell = {width: 10,  //редагувати синхронно з css
				 height: 10}
				 
// //Створимо масиви полів		 
var field; 	
var field_new; 	
var mouse_status;	
		 
				 
//Створимо масив img_pixels
var img_pixels = [];
for(var i = 0; i < img_size.height; i++) {
	img_pixels[i] = [1];
}

//Добавляємо таблицю
field = calculate_field(img_pixels);
table = create_table(table, img_size, img_pixels, field);
apply_field(table, field);

//Ініціалізація
img_pixels = init_image_color(1, img_size, img_pixels);
apply_img_pixels(table, img_pixels, img_size);

//Вішаємо хендлер на onclic на ссилку загрузки
downloader.onclick = hendler4save_img;

//*********//
function shift_field(field, img_size, position_cells) {
	
	//Динамічна зміна поля
	
	var img_size_right_depth_old = img_size.right_depth;
	var img_size_top_depth_old = img_size.top_depth;
	
	//Шукаємо нову глибину полів
	max_depth = 0;
	for(var i = 0; i < img_size.width; i++){
		if(field.top[i].length > max_depth){
			max_depth = field.top[i].length;
		}
	}
	img_size.top_depth = max_depth;

	max_depth = 0;
	for(var i = 0; i < img_size.height; i++){
		if(field.right[i].length > max_depth){
			max_depth = field.right[i].length;
		}
	}
	img_size.right_depth = max_depth;

	position_cells.x += (img_size.right_depth - img_size_right_depth_old);
	position_cells.y += (img_size.top_depth - img_size_top_depth_old);

	return({img_size, position_cells})
}


//*********//
function hendler4save_img() {
	var download_img = [];
	download_img[0] = [(img_size.height - 2), (img_size.width - 2)];
	for(var i = 1; i < (img_size.height - 1); i++){
		download_img[i] = [];
		for(var j = 1; j < (img_size.width - 1); j++){
			download_img[i][j - 1] = img_pixels[i][j];
		}
	}
	downloader.setAttribute('href', "data:text/plain;charset=utf-8,%EF%BB%BF" + encodeURIComponent(download_img));
	downloader.setAttribute('download', "imag_" + (img_size.height - 2) + "x" + (img_size.width - 2));
	
}

//*********//
//function chea

//*********//
function hendler4_onmousedown(event){

	if(event.which !== 1){ //Якщо нажата не ліва кнопка
		return(false);
	}

	//Змінюємо колір комірки
	var className = this.classList[1];
	var position = {x: 0, y: 0};
	var shifted_table_data, shifted_field;
	position.y = +className.substring(0, className.indexOf('c'));
	position.x = +className.substring(className.indexOf('c') + 1);
	
	switch(this.style.backgroundColor) {
		case('rgb(0, 0, 0)'): {
			img_pixels[position.y - img_size.top_depth][position.x - img_size.right_depth] = mouse_status = 1;//'#ffffff'; //#808080';
			break;
		}
		case('rgb(255, 255, 255)'): {
			img_pixels[position.y - img_size.top_depth][position.x - img_size.right_depth] = mouse_status = 0;//'#000000';
			break;
		}
	}
	apply_img_pixel(table, img_pixels, img_size, position);
}

//*********//
//Два разних еплаї
function apply_img_pixel(table, img_pixels, img_size, position_cells) {
	var color_cells;
	if(img_pixels[position_cells.y - img_size.top_depth][position_cells.x - img_size.right_depth]) {
		color_cells = '#ffffff';
	}
	else {
		color_cells = '#000000';
	}
	table.rows[position_cells.y].cells[position_cells.x ].style.backgroundColor = color_cells;
}

//*********//
function apply_img_pixels(table, img_pixels, img_size) {
	var color_cells;		
	for(var i = 0; i < img_size.width; i++) {
		for(var j = 0; j < img_size.height; j++){
			if(img_pixels[j][i]) {
				color_cells = '#ffffff';
			}
			else {
				color_cells = '#000000';
			}
			table.rows[j + img_size.top_depth].cells[i + img_size.right_depth].style.backgroundColor = color_cells;
		}
	}
} 

//*********//
function init_image_color(color, img_size, img_pixels) {
	for(var i = 0; i < img_size.width; i++) {
		for(var j = 0; j < img_size.height; j++){
			//console.log("j - " + j +"; i - " + i);
			img_pixels[j][i] = color;
		}
	}
	return(img_pixels);
}

//*********//
function hendler4_onmouseover(){
	
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
	
	//Виділення курсора
	table.rows[position.y].cells[position.x].style.backgroundImage = "url(round.png)";
	table.rows[position.y].cells[position.x].style.backgroundPosition = "center center";
	
	if(event.which !== 1){ //Якщо нажата не ліва кнопка
		return(false);
	}
	//Змінюємо колір комірки


	//console.log(img_pixels);
	
	switch(this.style.backgroundColor) {
		case('rgb(0, 0, 0)'): {
			img_pixels[position.y - img_size.top_depth][position.x - img_size.right_depth] = mouse_status;//'#ffffff'; //#808080';
			break;
		}
		case('rgb(255, 255, 255)'): {
			img_pixels[position.y - img_size.top_depth][position.x - img_size.right_depth] = mouse_status;//'#000000';
			break;
		}
	}
		
	apply_img_pixel(table, img_pixels, img_size, position);
}

//*********//
function chenge_limit_img(img_pixels){
	var width = img_pixels[0].length;
	var height = img_pixels.length;
	
	var status_right_add  =
		status_left_add   = 
		status_top_add    = 
		status_bottom_add = false; 
	
	//Перевірка на розширення
	for(var i = 0; i < height; i++){
		if(img_pixels[i][0] === 0){
			status_left_add = true;
			break;
		}
	}
	
	for(var i = 0; i < height; i++){
		if(img_pixels[i][width - 1] === 0){
			status_right_add = true;
			break;
		}
	}
	
	for(var i = 0; i < width; i++){
		if(img_pixels[0][i] === 0){
			status_top_add = true;
			break;
		}
	}
	
	for(var i = 0; i < width; i++){
		if(img_pixels[height - 1][i] === 0){
			status_bottom_add = true;
			break;
		}
	}
	
	//Виконання розширення

	if(status_left_add) {
		for(var i = 0; i < height; i++){
			img_pixels[i] = [1].concat(img_pixels[i]);
		}
		width = img_pixels[0].length;
	}
	
	if(status_right_add) {
		for(var i = 0; i < height; i++){
			img_pixels[i] = img_pixels[i].concat([1]);
		}
		width = img_pixels[0].length;
	}

	if(status_top_add || status_bottom_add){
		var empty_line = [];
		for(var i = 0; i < width; i++){
			empty_line[i] = 1;
		}
	}

	if(status_top_add) {
		img_pixels = [empty_line].concat(img_pixels);
		height = img_pixels.length;
	}

	if(status_top_add || status_bottom_add){
		var empty_line = [];
		for(var i = 0; i < width; i++){
			empty_line[i] = 1;
		}
	}
	
	if(status_bottom_add) {
		img_pixels = img_pixels.concat([empty_line]);
		height = img_pixels.length;
	}
	
	img_pixels = sub_limit_img(img_pixels);
	
	return(img_pixels);
	
	function sub_limit_img(img_pixels){
		var width = img_pixels[0].length;
		var height = img_pixels.length;
	
		var status_right_sub  =
			status_left_sub   = 
			status_top_sub    = 
			status_bottom_sub = 0;
		
		//Перевірка на зменшення
		for(var i = 0; i < height; i++){
			status_left_sub += img_pixels[i][1];	
		}
		status_left_sub -= height;
		
		for(var i = 0; i < height; i++){
			status_right_sub += img_pixels[i][width - 2];	
		}
		status_right_sub -= height;
		
		for(var i = 0; i < width; i++){
			status_top_sub += img_pixels[1][i];	
		}
		status_top_sub -= width;
		
		for(var i = 0; i < width; i++){
			status_bottom_sub += img_pixels[height - 2][i];	
		}
		status_bottom_sub -= width;
		
		if(width <= 10){
			status_right_sub = true;
			status_left_sub = true;
		}
		
		if(height <= 10){
			status_top_sub = true;
			status_bottom_sub = true;
		}
		
		//Зменшення

		if(!status_left_sub) {
			for(var i = 0; i < height; i++){
				img_pixels[i].splice(0, 1);
			}
		}
		
		if(!status_right_sub) {
			for(var i = 0; i < height; i++){
				img_pixels[i].splice((width - 2), 1);
			}
		}
		
		if(!status_top_sub) {
			img_pixels.splice(0, 1);
		}
		
		if(!status_bottom_sub) {
			img_pixels.splice((height - 2), 1);
		}
		
		if(!(status_right_sub && status_left_sub && status_top_sub && status_bottom_sub)) {
			img_pixels = sub_limit_img(img_pixels);
		}
		
		return(img_pixels);
	}
}

//*********//
function hendler4_onmouseout(){
	
	//Визначаємо координати комірки
	var className = this.classList[1];
	var position = {x: 0, y: 0};
	var shifted_table_data, shifted_field;
	position.y = +className.substring(0, className.indexOf('c'));// - img_size.top_depth;
	position.x = +className.substring(className.indexOf('c') + 1);// - img_size.right_depth;
	
	//Убираємо виділення курсора
	table.rows[position.y].cells[position.x].style.backgroundImage = "none";
	
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
}

//*********//
function hendler4_onmouseup(){
	
	//Добавляємо таблицю
	
	img_pixels = chenge_limit_img(img_pixels);
	//console.log(img_pixels);
	field = calculate_field(img_pixels);		
	//console.log(img_pixels);
	console.log("------");
	table.innerHTML = "";
	
	img_size.top_depth   = field.top[0].length;
	img_size.right_depth = field.right[0].length;
	img_size.width       = img_pixels[0].length;
	img_size.height      = img_pixels.length;
	
	table = create_table(table, img_size, img_pixels, field);

	//Ініціалізація
	apply_img_pixels(table, img_pixels, img_size);
	
}