$(function() {
  var collection, todoList;
  $.cookie.json = true;
  todoList = false;
  collection = new Collection;
  collection.restore();
  $('#lists').on("click", "li", function() {
    var id, title;
    id = $(this).data('list-id');
    title = $(this).html();
    todoList = new List(id, title);
    todoList.fetch();
    $('#lists li').removeClass('selected');
    $(this).addClass('selected');
    $('.main h1').html(title);
    $('.main .toolbar').removeClass('hidden');
    $('.remove').addClass('hidden');
    $(this).find('.remove').removeClass('hidden');
  });
  $(document).on("click", "#add-list", function() {
    collection.create();
  });
  $('#new-list').keypress(function(e) {
    if (e.which === 13) {
      return collection.create();
    }
  });
  $(document).on("click", "#add-todo", function() {
    if (todoList) {
      todoList.create();
    }
  });
  $('#new-todo').keypress(function(e) {
    if (e.which === 13 && todoList) {
      return todoList.create();
    }
  });
  $('#todo-list').on("click", "input[type='checkbox']", function(e) {
    var checkbox, todo;
    checkbox = e.target;
    todo = {
      id: $(checkbox).closest('li').data("todo-id"),
      complete: checkbox.checked
    };
    todoList.update(todo);
  });
  $('#todo-list').on("dblclick", "input[type='text']", function(e) {
    var ro;
    ro = $(this).prop('readonly');
    if (ro) {
      $(this).prop('readonly', !ro).focus();
      $(this).parent().append('<button class="button">Delete</button>');
    }
  });
  $('#todo-list').on("blur", "input[type='text']", function(e) {
    var id, input, todo;
    input = e.target;
    id = $(input).closest('li').data("todo-id");
    todo = {
      _id: id,
      complete: $('#todo-complete-' + id).checked,
      content: $(input).val()
    };
    todoList.update(todo);
    $(input).prop('readonly', true);
    setTimeout((function() {
      $(input).parent().find('button').removeTodo();
    }), 100);
  });
  $('#todo-list').on("keyup", "input[type='text']", function(e) {
    var id, input, todo;
    if (e.which === 13) {
      input = $(':focus');
      id = $(input).closest('li').data("todo-id");
      todo = {
        _id: id,
        complete: $('#todo-complete-' + id).checked,
        content: $(input).val()
      };
      todoList.update(todo);
      $(input).prop('readonly', true);
      return $(input).parent().find('button').remove();
    }
  });
  $('#todo-list').on("click", "button", function(e) {
    var id;
    id = $(this).closest('li').data("todo-id");
    todoList.removeTodo(id);
  });
  return $('#lists').on("click", ".remove", function(e) {
    var id;
    id = $(this).closest('li').data("list-id");
    collection.remove(id);
  });
});
