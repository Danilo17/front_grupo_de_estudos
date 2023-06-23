import React,{useEffect, useState} from 'react';
import Modal from 'react-modal';
import ReactLoading from 'react-loading';
import {customStyles} from './ModalStyle';
//const userName = window.localStorage.getItem('nome')
const userId = window.localStorage.getItem("id");
const userToken = window.localStorage.getItem("token");



Modal.setAppElement("#root");

export const MyGroupsResullt = (props) => {
  
  const [modalIsOpen, setIsOpen] = useState(false);
  const [groupId, setGroupId] = useState("")
  const [groupName, setGroupName] = useState("")
  const [groupDesc, setGroupDesc] = useState("")
  const [groupMeta, setGroupMeta] = useState("")
  const [groupDataEncontros, setGropDataEncontros] = useState("")
  const [groupMaterial, setGroupMaterial] = useState("")
  const [groupMembers, setGroupMembers] = useState([])

  const [loading, setLoading] = useState(true)

  function deleteGroup(e){
    e.preventDefault()
    if (window.confirm('Você tem certeza que deseja excluir o grupo?')) {

      var requestOptions = {
        method: 'DELETE',
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          'x-access-token': userToken
        },
        redirect: 'follow'
      };
      
      fetch(`https://grupo-de-estudos-back.vercel.app/delete-grupo/id=${groupId}`, requestOptions)
        .then((res) => res.json())
        .then((data) => {
           console.log(data)
           window.location.reload()
           
        }).catch(error =>{if(error){ alert("A exclusão do grupo falhou! Verifique a conexão!")}})
 
    }


    }

  function exitGroup(e){
    e.preventDefault()
    //alert(groupId)
    
    if (window.confirm('Você tem certeza que deseja sair do grupo?')) {
      var index = groupMembers.indexOf(userId)
      groupMembers.splice(index,1)
      var data = JSON.stringify({
        membros:groupMembers,
        token: userToken
      })

      var requestOptions = {
        method: 'PUT',
        body:data,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*"
        },
        redirect: 'follow'
      };
      
      fetch(`https://grupo-de-estudos-back.vercel.app/grupo/remove-membro/id=${groupId}`, requestOptions)
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          window.location.reload()
          
        }).catch(error =>{if(error){ alert("A saída do grupo falhou! Verifique a conexão!")}})

    }
  
  }

  function openModal(id, nome,descricao,meta,data_encontros,material,membros) {
    setGroupId(id)
    setGroupName(nome)
    setGroupDesc(descricao)
    setGroupMeta(meta)
    setGropDataEncontros(data_encontros)
    setGroupMaterial(material)
    setGroupMembers(membros)
    setIsOpen(true);
    
  }

  function render(){
    const getBlob = () =>{
      fetch(groupMaterial)
      .then(res => res.blob())
      .then(blob => {
        console.log(blob);
        var url = window.URL.createObjectURL(blob);
        window.location.href = url
        console.log(url)
      });
    }

    getBlob()
    
  /*   var win = window.open();
    win.document.write('<iframe src="' + groupMaterial  + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'); */
  }

  function closeModal() {
    setIsOpen(false);
  }

  let allGroupsFilter = []
  let allGroups = props.dataSearch


  for(var i in allGroups){
    if ((allGroups[i]["membros"].includes(userId))){
        allGroupsFilter.push(allGroups[i])
    }
  }

  useEffect(()=>{
    if(allGroups.length>0){
      setLoading(false)
    }
  },[allGroups.length])
  
    return(

     loading===true?<div className="containerLoading">
      <ReactLoading type={"spin"} color={"#528abe"} height={40} width={40} />
    </div> :

    <section className='py-4'>

    <div className='row'>

    {allGroupsFilter.length>0 ? allGroupsFilter.map((item, index)=>{
        return(
          
          <div key={index}>
            <div  className='groupResults'>
                <h5 style={{fontSize:"15px", color:"#305F86"}}>{item.nome}</h5>
                <img className='imageGroupResults' src='https://cdn-icons-png.flaticon.com/512/2995/2995433.png' alt='Imagem ilustrativa do grupo'/>
                {/* <h2 style={{fontSize:"10px", color:"#305F86"}}>{item.descricao}</h2> */}
                <button className='buttonGroup' onClick={() => openModal(item._id, item.nome, item.descricao, item.meta, item.data_encontros, item.material, item.membros)} >Ver detalhes</button>

                  <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
          
                  >
                    <div style={{display:"flex", flexDirection:"row", justifyContent:"end"}}>
                      <img src='https://cdn-icons-png.flaticon.com/512/463/463612.png' onClick={closeModal} alt="close" width={30} height={30} style={{cursor:'pointer'}}/>
                    </div>

                    <h2 className='titleModal'>{groupName}</h2>

                    <form style={{marginTop:"50px", marginBottom:"50px", border:"none"}}>
                      <div><p className='textModal'><b>Descrição: </b>{groupDesc}</p></div>
                      <div><p className='textModal'><b>Metas: </b>{groupMeta}</p></div>
                      <div><p className='textModal'><b>Encontros: </b>{groupDataEncontros}</p></div>
                      <div><p className='textModal'><b>Material: </b><span onClick={render} className='linkModal'>material.pdf</span></p></div>
                      {groupMembers[0] === userId?
                      <div><button onClick= {deleteGroup} title='Excluir grupo' className="buttonExitGroup">
                      <span style={{fontSize:"15px"}}>Excluir grupo</span>
                      </button></div>:
                       <div><button onClick= {exitGroup} title='Sair do grupo' className="buttonExitGroup">
                      <span style={{fontSize:"15px"}}>Sair do grupo</span>
                      </button></div> 
                      
                      }
                      
                    </form>
                  </Modal>


            </div>

          </div>
        
        )
      }): <img className='imageGroupResults' src='https://cdn-icons-png.flaticon.com/512/7486/7486831.png' alt='Imagem ilustrativa do grupo'/> }
      </div>
      </section>
      );
}