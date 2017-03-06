var MenuView = {
    onoff: false,

    init: function () {

        this.attachEvents();
    },

    onSwitchCommand: function(){
        this.onoff = !this.onoff;
        this.viewModel.onSwitchCommand(this.onoff);
    },

    onFileSelected: function(file) {
        this.viewModel.onFileSelected(file);
    },

    onRegister: function(settings) {

        this.viewModel.onRegister(settings);
    },

    attachEvents: function() {

        var onoff = this.onSwitchCommand.bind(this);
        var fileSelect = this.onFileSelected.bind(this);
        var register = this.onRegister.bind(this);

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

        $('#gpxfile').on("change", function() {

            fileSelect($(this).get(0).files[0]);
        });

        $('#register-send').on("click", function() {
            var user = $("#client-username").val();
            if(!user) {
                alert("Enter user name");
                return;
            }
            
            register({user: user});
        });
    }
};