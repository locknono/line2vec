export function showflux(id){
    clear()
    $.ajax({
        type:'get',
        url: staticVar.urlBase + '/getTraffic',
        data:{
            lineid: id
        },
        success: function(data){
            console.log(data.id)
        }
    })
}