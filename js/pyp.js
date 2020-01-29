function run_pyp_demo(size_multiplier,
        font_size_multiplier,
        num_variables,
        image_path) {
    var nv = get_num_variables(num_variables);
    var image_width = 1358;
    var image_height = 1388;
    if (nv == 3) {
        var image_width = 600;
        var image_height = 450;
    }
    size_multiplier = typeof size_multiplier !== 'undefined' ?
            size_multiplier : 0.7;
    font_size_multiplier = typeof font_size_multiplier !== 'undefined' ?
            font_size_multiplier : 1.0;
    create_pyp_form(nv, image_path, font_size_multiplier);
    var a = validate_concentration(nv);
    var d = validate_discount(nv);
    var medium = create_pyp_canvas(
            image_width*size_multiplier, 
            image_height*size_multiplier,
            nv,
            image_path);
    update_pyp_tree(nv, image_path, font_size_multiplier);
}

function create_pyp_form(num_variables, image_path, font_size_multiplier) {
    var nv = get_num_variables(num_variables);
    var pyp_div = document.createElement("div");
    pyp_div.setAttribute("name", "pyp_" + nv + "_div");
    pyp_div.setAttribute("class", "pyp-form");
    document.getElementsByTagName("body")[0].appendChild(pyp_div);

    pyp_form = document.createElement("form");
    pyp_form.setAttribute("name", "pyp_" + nv + "_form");
    l = document.createElement("label");
    l.for = "cparam";
    l.innerHTML = "Concentration parameter: ";
    a = document.createElement("input");
    a.setAttribute("label", "label");
    a.setAttribute("type", "number");
    a.setAttribute("name", "concentration_param");
    a.setAttribute("id", "cparam");
    a.setAttribute("min", "0.0");
    a.setAttribute("max", "100000.0");
    a.setAttribute("step", "any");
    a.setAttribute("value", "1.5");
    a.setAttribute("onkeypress", "parse_key_press(event, " + nv + ");");
    dl = document.createElement("label");
    dl.for = "dparam";
    dl.innerHTML = "Discont parameter: ";
    d = document.createElement("input");
    d.setAttribute("label", "label");
    d.setAttribute("type", "number");
    d.setAttribute("name", "discount_param");
    d.setAttribute("id", "dparam");
    d.setAttribute("min", "0.0");
    d.setAttribute("max", "1.0");
    d.setAttribute("step", "0.1");
    d.setAttribute("value", "0.5");
    d.setAttribute("onkeypress", "parse_key_press(event, " + nv + ");");
    b = document.createElement("input");
    b.setAttribute("type", "button");
    b.setAttribute("id", "update_" + nv + "_button");
    b.setAttribute("value", "Update");
    b.setAttribute("onclick", "update_pyp_tree(" + nv + 
            ",'" + image_path + "'" +
            "," + font_size_multiplier + ");");
    i = document.createElement("input");
    i.setAttribute("type", "text");
    i.setAttribute("name", "StackOverflow1370021");
    i.setAttribute("value", "Fix IE bug");
    i.setAttribute("style", "display: none;");

    pyp_form.appendChild(l);
    pyp_form.appendChild(a);
    pyp_form.appendChild(dl);
    pyp_form.appendChild(d);
    pyp_form.appendChild(b);
    pyp_form.appendChild(i);
    pyp_div.appendChild(pyp_form);
}

function parse_key_press(event, num_variables) {
    var nv = get_num_variables(num_variables);
    if (typeof event == 'undefined' && window.event) {
        event = window.event;
    }
    if (event.keyCode == 13) {
        document.getElementById("update_" + nv + "_button").click();
    }
    return false;
}

function get_num_variables(num_variables) {
    if (num_variables != 3) {
        num_variables = 4;
    }
    return num_variables;
}

function validate_concentration(num_variables) {
    var nv = get_num_variables(num_variables);
    var a = parseFloat(document.forms["pyp_" + nv +
            "_form"]["concentration_param"].value);
    if (a == null || a == "" || a < 0.0 || a > 10000000.0) {
        alert("Concentration parameter must be between 0.0 and 10000000.0");
        return false;
    }
    return a;
}
function validate_discount(num_variables) {
    var nv = get_num_variables(num_variables);
    var d = parseFloat(document.forms["pyp_" + nv +
            "_form"]["discount_param"].value);
    if ((d == null) || (d < 0.0) || (d >= 1.0)) {
        alert("Discount parameter must be between 0.0 and 1.0");
        return false;
    }
    return d;
}

function update_pyp_tree(num_variables, image_path, font_size_multiplier) {
    var nv = get_num_variables(num_variables);
    var a = validate_concentration(nv);
    var d = validate_discount(nv);
    if (nv == 3) {
        annotate_pyp_3_tree(a, d, image_path, font_size_multiplier);
    } else {
        annotate_pyp_4_tree(a, d, image_path, font_size_multiplier);
    }
    return false;
}

function create_pyp_canvas(w, h, num_variables, image_path) {
    var nv = get_num_variables(num_variables);
    var canvas = document.createElement("canvas");
    canvas.id = "pyp_" + nv + "_canvas";
    canvas.width = w;
    canvas.height = h;
    canvas.style.border = "1px solid #d3d3d3";
    document.body.appendChild(canvas);
    var context = canvas.getContext("2d");
    embed_pyp_tree_in_canvas(canvas, context, image_path);
    return [canvas, context];
}

function annotate_pyp_3_tree(a, d, image_path, font_size_multiplier) {
    var canvas = document.getElementById("pyp_3_canvas");
    var context = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    reset_pyp_canvas(canvas, context, image_path);
    context.font = 24*font_size_multiplier + "px Arial";
    context.textAlign="left";
    context.fillText(a, 0.37*w, 0.045*h);
    context.fillText(d, 0.74*w, 0.045*h);
    context.font = 22*font_size_multiplier + "px Arial";
    context.fillText(calc_pyp_prob(a, (1-d), (2-d)).toFixed(3), 0.915*w, 0.139*h);
    context.fillText(calc_pyp_prob(a, (1-d), (a+d)).toFixed(3), 0.915*w, 0.339*h);
    context.fillText(calc_pyp_prob(a, (a+d), (1-d)).toFixed(3), 0.915*w, 0.559*h);
    context.fillText(calc_pyp_prob(a, (a+d), (1-d)).toFixed(3), 0.915*w, 0.759*h);
    context.fillText(calc_pyp_prob(a, (a+d), (a+(2*d))).toFixed(3), 0.915*w, 0.959*h);
    return false;
}

function annotate_pyp_4_tree(a, d, image_path, font_size_multiplier) {
    var canvas = document.getElementById("pyp_4_canvas");
    var context = canvas.getContext("2d");
    var w = canvas.width;
    var h = canvas.height;
    reset_pyp_canvas(canvas, context, image_path);
    context.font = 24*font_size_multiplier + "px Arial";
    context.textAlign="left";
    context.fillText(a, 0.38*w, 0.02*h);
    context.fillText(d, 0.685*w, 0.02*h);
    context.font = 22*font_size_multiplier + "px Arial";
    context.fillText(calc_pyp_prob(a, (1-d), (2-d), (3-d)).toFixed(3), 0.93*w, 0.067*h);
    context.fillText(calc_pyp_prob(a, (1-d), (2-d), (a+d)).toFixed(3), 0.93*w, 0.133*h);
    context.fillText(calc_pyp_prob(a, (1-d), (a+d), (2-d)).toFixed(3), 0.93*w, 0.198*h);
    context.fillText(calc_pyp_prob(a, (1-d), (a+d), (1-d)).toFixed(3), 0.93*w, 0.263*h);
    context.fillText(calc_pyp_prob(a, (1-d), (a+d), (a+(2*d))).toFixed(3), 0.93*w, 0.328*h);
    context.fillText(calc_pyp_prob(a, (a+d), (1-d), (1-d)).toFixed(3), 0.93*w, 0.393*h);
    context.fillText(calc_pyp_prob(a, (a+d), (1-d), (2-d)).toFixed(3), 0.93*w, 0.459*h);
    context.fillText(calc_pyp_prob(a, (a+d), (1-d), (a+(2*d))).toFixed(3), 0.93*w, 0.524*h);
    context.fillText(calc_pyp_prob(a, (a+d), (1-d), (2-d)).toFixed(3), 0.93*w, 0.590*h);
    context.fillText(calc_pyp_prob(a, (a+d), (1-d), (1-d)).toFixed(3), 0.93*w, 0.655*h);
    context.fillText(calc_pyp_prob(a, (a+d), (1-d), (a+(2*d))).toFixed(3), 0.93*w, 0.722*h);
    context.fillText(calc_pyp_prob(a, (a+d), (a+(2*d)), (1-d)).toFixed(3), 0.93*w, 0.787*h);
    context.fillText(calc_pyp_prob(a, (a+d), (a+(2*d)), (1-d)).toFixed(3), 0.93*w, 0.853*h);
    context.fillText(calc_pyp_prob(a, (a+d), (a+(2*d)), (1-d)).toFixed(3), 0.93*w, 0.918*h);
    context.fillText(calc_pyp_prob(a, (a+d), (a+(2*d)), (a+(3*d))).toFixed(3), 0.93*w, 0.983*h);
    return false;
}

function reset_pyp_canvas(canvas, context, image_path) {
    clear_canvas(canvas, context);
    embed_pyp_tree_in_canvas(canvas, context, image_path);
}

function embed_pyp_tree_in_canvas(canvas, context, image_path) {
    var img = new Image();
    img.src = image_path;
    img.id = "pyp_image_" + image_path
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
}

function clear_canvas(canvas, context) {
    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    context.beginPath();
}

function calc_pyp_prob(alpha, numerator1, numerator2, numerator3) {
    if(typeof(numerator3)==='undefined') {
        return ((numerator1/(alpha+1))*(numerator2/(alpha+2)));
    } else {
        return ((numerator1/(alpha+1))*(numerator2/(alpha+2))*
                (numerator3/(alpha+3)));
    }
}
