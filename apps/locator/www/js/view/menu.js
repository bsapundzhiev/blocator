var MenuView = {
    onoff: false,

    init: function () {

        this.attachEvents();

    },

    onSwitchCommand: function(){
        this.onoff = !this.onoff;
        this.viewModel.onSwitchCommand(this.onoff);
    },

    attachEvents: function() {

        var onoff = this.onSwitchCommand.bind(this);

        $("li.dropdown").click(function() {
          $("nav.navbar").toggleClass("open");
        });

        $('.btn-toggle').click(function() {

            $(this).find('.btn').toggleClass('active');
            if ($(this).find('.btn-primary').length > 0) {
                $(this).find('.btn').toggleClass('btn-primary');
            }
            $(this).find('.btn').toggleClass('btn-default');
            onoff();
        });
    }
};