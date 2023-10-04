#!/usr/bin/env bash

############################################################## declare functions

function jestCommand () {
    npx jest --forceExit --detectOpenHandles --passWithNoTests "$@";
}

function setupStorage () {
    blockTitle 'setup db';

    npm run db:teardown;
    npm run db:setup;
}

function testWithSeeded () {
    blockTitle 'test with seeds.';

    npm run db:seed;

    jestCommand __tests__/

}

function blockTitle () {
    echo '';
    echo '//////////////////////////////////////////////////';
    echo '//';
    echo "//    $1";
    echo '//';
    echo '//////////////////////////////////////////////////';
    echo '';
}

function initialize () {
    blockTitle 'Start to test 🎉';
    date;
}

function terminalize () {
    blockTitle 'Finish to test 🍵';
    date;
}

################################################################### execute main

initialize;

setupStorage; # teardown > setup > seed:master

if [ $# = 0 ]; then
    testWithSeeded;

    exit;
fi

mode="${1:-all}";
target=$2;

if [ $mode = '--empty' ]; then
    if [ "$target" = '' ]; then
        testWithEmpty;
    else
        jestCommand ${@:2};
    fi

    exit;
fi

if [ $mode = '--seeded' ]; then
    if [ "$target" = '' ]; then
        testWithSeeded;
    else
        npm run db:seed:dev;
        jestCommand ${@:2};
    fi

    exit;
fi

npm run db:seed:dev;
jestCommand "$@";
