
			var reader = new FileReader();
			
			var img_size;        				//створюються в хендлері, нужні доступними в глобальному об'єкті
			var img_pixels_user; 				//
			
			var size_cell = {width: 10,  //редагувати синхронно з css
							 height: 10}
							 
			reader.onload = function(event) {
				var file_values = event.target.result.split(",");
				var width = +file_values[0];
				var height = +file_values[1];
				img_pixels = [];
				for(var i = 0; i < width; i++){
					img_pixels[i] = [];
					for(var j = 0; j < height; j++){
						img_pixels[i][j] = +file_values[i*height + j + 2];
					}
				}
				
				var field = calculate_field(img_pixels);
				
				img_size = {width: img_pixels[0].length,
					height: img_pixels.length,
					top_depth: field.top[0].length,
					right_depth: field.right[0].length};

				img_pixels_user = create_and_init_image_color( 3, img_pixels[0].length, img_pixels.length);
				table = create_table(table, img_size, img_pixels_user, field);
			};
			 
			reader.onerror = function(event) {
				console.error("Файл не может быть прочитан! код " + event.target.error.code);
			};
			
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

			function calculate_field(img_pixels) {
				var right_field_line = [];
				var top_field_line = [];
				var height = img_pixels.length;
				var width = img_pixels[0].length;
				var field = {right: [],
							 top:   []};
				var max_depth = 0;
				var line_depth;
							 
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

			function create_table(table, img_size, img_pixels, field) {
				var new_elem_table = document.createElement('tbody');
				new_elem_table.innerHTML = create_tbody(img_size.height + img_size.top_depth, img_size.width + img_size.right_depth, img_size);
				table.appendChild(new_elem_table);
				apply_img_pixels(table, img_pixels, img_size);
				apply_field(table, field);
				
				//Робимо товсті лінії
				table = make_thick_border(table, img_size);
				
				//Вішаємо хендлер на onclic на комірки image
				for(var i = img_size.right_depth; i < (img_size.right_depth + img_size.width); i++){
					for(var j = img_size.top_depth; j < (img_size.top_depth + img_size.height); j++){
						table.rows[j].cells[i].onclick = hendler4create_game;
					}
				}
				return(table);
			}
			
			function apply_field(table, field) {
				var color_cells;	
				var right_depth = field.right[0].length;
				var top_depth = field.top[0].length;
				for(var i = 0; i < field.top.length; i++) {
					for(var j = 0; j < field.top[0].length; j++){
						table.rows[top_depth - j - 1].cells[right_depth + i].innerHTML = field.top[i][j];
					}
				}
				for(var i = 0; i < field.right.length; i++) {
					for(var j = 0; j < field.right[0].length; j++){
						table.rows[i + top_depth].cells[right_depth - j - 1].innerHTML = field.right[i][j];
					}
				}
			}
			
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
								table_string += "<td class='field'></td>";
								break;
							} 
							default: {
								table_string += "<td class='image " + i + "c" + j + "'></td>";
							}
						}
					}
					table_string += "</tr>";
				}
				return(table_string);
			}


			function hendler4create_game(){
			
				//Змінюємо колір комірки
				var className = this.classList[1];
				var position = {x: 0, y: 0};
				var shifted_table_data, shifted_field;
				position.y = +className.substring(0, className.indexOf('c'));
				position.x = +className.substring(className.indexOf('c') + 1);
				
				var limit_points = {right_points: 0,
					left_points: 0,
					top_points: 0,
					bottom_points: 0};
				
				switch(this.style.backgroundColor) {
					case('rgb(0, 0, 0)'): {
						img_pixels_user[position.y - img_size.top_depth][position.x - img_size.right_depth] = 1;//'#ffffff'; //#808080';
						break;
					}
					case('rgb(255, 255, 255)'): {
						img_pixels_user[position.y - img_size.top_depth][position.x - img_size.right_depth] = 3;//'#000000';
						break;
					}
					case('rgb(128, 128, 128)'): {
						img_pixels_user[position.y - img_size.top_depth][position.x - img_size.right_depth] = 0;
						break;
					}
					
				}

				apply_img_pixel(table, img_pixels_user, img_size, position);
			}

			
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
			
			function make_thick_border(table, img_size) {
				var rows = table.childNodes[0].childNodes;
				var number_cells = rows[0].childNodes.length;
				var number_rows = rows.length;
				
				//Горизонтальні лінії
				for(var i = (img_size.top_depth - 1); i < (number_rows - 1); i += 5) { // -1 щоб не рисувать товстий бордер в останнього рядка
					for(var j = 0; j < (number_cells); j += 1) {
						table.rows[i].cells[j].style.borderBottom = '2px solid #000000';
					}
				}
				
				//Вертикальні лінії
				for(var i = (img_size.right_depth - 1); i < (number_cells - 1); i += 5) { // -1 щоб не рисувать товстий бордер в останнього стовпчика
					for(var j = 0; j < (number_rows); j += 1) {
						table.rows[j].cells[i].style.borderRight = '2px solid #000000';
					}
				}
				
				return table;		
			}