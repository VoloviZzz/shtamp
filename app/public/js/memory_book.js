$(document).ready(() => {

    const State = {
        searchMode: 'default',
    }

    $('#search-fio').on('keydown', function(e) {
        if (pressedEnter(e)) {
            $('#search-more-button').attr('data-part', '0').hide();
            return findGrave();
        }
    });

    $('#find-graves').on('click', function(e) {
        $('#search-more-button').attr('data-part', '0').hide();
        return findGrave();
    });

    $('#search-clear-str').on('click', () => {
        $('#search-fio').val('');
        $('#search-list').html('');
        $('.search-error').hide();
        $('.search-info').show();
        $('#search-more-button').attr('data-part', '0').hide();
    });

    $(document).on('click', '#search-more-button', function() {
        var part = +this.dataset.part;
        return findGrave(part);
    })

    if ($('#general-deads-container .memory-book__item').length < +$('#general-deads-container .search-results-count').text()) {
        $('#load-more-button').show();
    }


    $('#load-more-button').on('click', function(e) {
        let part = +this.dataset.part;
        return loadMoreGrave(part);
    })

    $('.alphavite-word').on('click', function(e) {
        State.curAlphaviteLetter = this.textContent;
        $('#alphavite-results').html('');
        State.curAlphaviteLetter = null;
        $('#alphavite-load-more').attr('data-part', 1);
        alphaviteSearch(this.textContent);
    })


    function alphaviteSearch(word, part = 0) {

        const postData = {
            ctrl: 'alphavite-search',
            value: word,
            part
        };

        $.post('/api/memory_book/alphavite-search', postData).done(result => {
            $('#alphavite-results').html($('#alphavite-results').html() + result.content);

            if($('#alphavite .memory-book__item').length < +$('#alphavite .search-results-count').text()) {
                $('#alphavite-load-more').show();
            }
            else {
                $('#alphavite-load-more').hide();
            }
        })
        .catch(e => {
            console.log(e);
        })
    }

    $('#alphavite-load-more').on('click', function(e) {
        alphaviteLoadMore(this.dataset.part, this);
    });

    function alphaviteLoadMore(part = 0, elem) {
        alphaviteSearch(State.curAlphaviteLetter, part);
        $(elem).attr('data-part', +part + 1);
    }

    function loadMoreGrave(part = 0, options = {}) {

        const postData = {
            ctrl: 'loadMore',
            part
        };

        $.post("/api/memory_book/loadMore", postData).done(res => {

            let $loadMoreButton = $('#load-more-button');
            let curPart = +$loadMoreButton.get(0).dataset.part;
            let nextPart = curPart + 1;

            $loadMoreButton.attr('data-part', nextPart);
            $('#general-deads-container').html($('#general-deads-container').html() + res.data.content);

            if ($('#general-deads-container .memory-book__item').length >= +$('#general-deads-container .search-results-count').text()) {
                $('#load-more-button').remove();
            }
        });
    }

    function findGrave(part) {
        part = part || 0;

        let str = $('#search-fio').val().trim();
        let search_mode = State.searchMode;

        let postData = {
            fullname: $('#search-fio').val().trim() || '',
            search_mode,
            part,
            ctrl: 'search',
        };

        if (postData.fullname == '') {
            alert('Необходимо ввести имя');
            return;
        }

        if (part == 0) $('#search-list').html(`<img id="search-loader" src="/img/load.gif" style="margin: 20px auto; display: block;">`);

        $('.search-error').hide();
        $('.search-info').hide();

        $.post("/api/memory_book/search", postData).done(res => {

            if (res.status == 'ok') {

                if (part == 0) $('#search-list').html('');

                $('#search-list').append(res.content);

                var nameParts = postData.fullname.split(' ');

                if ($('#search .search-result__item').length < Number($('#search .search-results-count').text())) {
                    $('#search-more-button').show();
                    $('#search-more-button').attr('data-part', Number($('#search-more-button')[0].dataset.part) + 1);
                } else {
                    $('#search-more-button').hide();
                }
            } else {
                $('#search-list').html('');
                $('.search-error').show();
                $('.search-info').hide();
            }
        });
    }
})