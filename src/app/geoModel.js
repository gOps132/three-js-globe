import { drawThreeGeo } from "App/threeGeoJSON.js";

export class geoModel {
    constructor(p_r_model, p_r_scene, p_model_name) {
        this.m_model_name = p_model_name;
        this.m_mesh_array = [];
        this.m_border_array = [];

        this.misc_mesh_params = {show: true};
        this.misc_border_params = {show: true};

        // references
        this.m_r_model = p_r_model;
        this.m_r_scene = p_r_scene;
        this.m_r_directed_mesh = null;
    };

    draw(p_radius, p_shape, p_draw_options) {
        drawThreeGeo(
            this.m_r_model,
            p_radius, p_shape,
            this.m_r_scene,
            this.m_mesh_array,
            this.m_border_array,
            p_draw_options);
    }

    added_to(p_r_directed_mesh) {
        this.m_r_directed_mesh = p_r_directed_mesh;
        for(var i = 0; i < this.m_mesh_array.length; i++) {
            this.m_r_directed_mesh.add(this.m_mesh_array[i]);
        }

        for(var i = 0; i < this.m_border_array.length; i++) {
            this.m_r_directed_mesh.add(this.m_border_array[i]);
        }
    }

    gui_add(p_dat_gui_add_to) {
        this.model_folder = p_dat_gui_add_to.addFolder(this.m_model_name);
        this.model_folder.add(this.misc_mesh_params, 'show').name("show fill")
            .onChange((value) => {
                if(value) {
                    for(var i = 0; i < this.m_mesh_array.length; i++) {
                        this.m_r_scene.add(this.m_mesh_array[i]);
                        this.m_r_directed_mesh.add(this.m_mesh_array[i]);
                    }
                } else {
                    for(var i = 0; i < this.m_mesh_array.length; i++) {
                        this.m_mesh_array[i].geometry.dispose();
                        this.m_mesh_array[i].material.dispose();
                        this.m_r_scene.remove(this.m_mesh_array[i]);
                        this.m_r_directed_mesh.remove(this.m_mesh_array[i]);
                    }
                }
            })

        this.model_folder.add(this.misc_border_params, 'show').name("show border")
        .onChange((value) => {
            if(value) {
                for(var i = 0; i < this.m_border_array.length; i++) {
                    this.m_r_scene.add(this.m_border_array[i]);
                    this.m_r_directed_mesh.add(this.m_border_array[i]);
                }
            } else {
                for(var i = 0; i < this.m_border_array.length; i++) {
                    this.m_border_array[i].geometry.dispose();
                    this.m_border_array[i].material.dispose();
                    this.m_r_scene.remove(this.m_border_array[i]);
                    this.m_r_directed_mesh.remove(this.m_border_array[i]);
                }
            }
        })
    }
}